import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface VoteAccountInfo {
  votePubkey: string;
  nodePubkey: string; // identity
  activatedStake: number;
  commission: number;
  epochCredits: [number, number, number][]; // [epoch, credits, prevCredits]
}

interface ClusterNode {
  pubkey: string; // identity
  version: string | null;
}

interface StakewizValidator {
  identity: string;
  name: string | null;
}

const STAKEWIZ_VALIDATORS_URL = 'https://api.stakewiz.com/validators';

interface EpochInfo {
  epoch: number;
  slotIndex: number;     // 0-based offset within current epoch
  slotsInEpoch: number;
  absoluteSlot: number;
}

// getLeaderSchedule returns { [identity]: number[] } where the numbers are
// 0-based slot offsets within the queried epoch.
type LeaderSchedule = Record<string, number[]>;

@Injectable()
export class ValidatorMetaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ValidatorMetaService.name);
  private interval: NodeJS.Timeout;
  private readonly REFRESH_MS = 5 * 60_000; // 5분

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    // 시작 후 10초 지연 (DB 연결 안정화)
    setTimeout(() => this.refresh(), 10_000);
    this.interval = setInterval(() => this.refresh(), this.REFRESH_MS);
  }

  onModuleDestroy() {
    clearInterval(this.interval);
  }

  private async refresh() {
    const rpcUrl = process.env.HELIUS_RPC_URL ?? process.env.RPC_URL;
    if (!rpcUrl) {
      this.logger.warn('No RPC_URL — skipping validator metadata refresh');
      return;
    }

    // DB에 있는 validator identity 목록
    const knownValidators = await this.prisma.validatorStats.findMany({
      select: { identity: true },
    });
    if (knownValidators.length === 0) return;

    const identitySet = new Set(knownValidators.map((v) => v.identity));

    try {
      const [voteAccounts, clusterNodes, nameMap] = await Promise.all([
        this.rpcCall<{ current: VoteAccountInfo[]; delinquent: VoteAccountInfo[] }>(
          rpcUrl, 'getVoteAccounts',
        ),
        this.rpcCall<ClusterNode[]>(rpcUrl, 'getClusterNodes'),
        this.fetchValidatorNames(identitySet),
      ]);

      // identity → vote account info 매핑
      const allVoteAccounts = [
        ...(voteAccounts?.current ?? []),
        ...(voteAccounts?.delinquent ?? []),
      ];
      const voteMap = new Map<string, VoteAccountInfo>();
      for (const va of allVoteAccounts) {
        if (identitySet.has(va.nodePubkey)) {
          voteMap.set(va.nodePubkey, va);
        }
      }

      // identity → client version 매핑
      const clientMap = new Map<string, string>();
      for (const node of clusterNodes ?? []) {
        if (identitySet.has(node.pubkey) && node.version) {
          clientMap.set(node.pubkey, node.version);
        }
      }

      // 일괄 업데이트
      let updated = 0;
      for (const identity of identitySet) {
        const va = voteMap.get(identity);
        const client = clientMap.get(identity);
        const name = nameMap.get(identity);

        if (!va && !client && !name) continue;

        const earliestEpoch = va?.epochCredits?.length
          ? va.epochCredits[0][0]
          : undefined;

        await this.prisma.validatorStats.update({
          where: { identity },
          data: {
            ...(va && {
              voteAccount: va.votePubkey,
              stake: BigInt(Math.floor(va.activatedStake)),
              commission: va.commission,
              ...(earliestEpoch !== undefined && { activeSinceEpoch: earliestEpoch }),
            }),
            ...(client && { client }),
            ...(name && { name }),
          },
        });
        updated++;
      }

      this.logger.log(
        `Updated ${updated} validator metadata from RPC + Stakewiz (named: ${nameMap.size})`,
      );

      await this.refreshLeaderSlots(rpcUrl, identitySet);
    } catch (err) {
      this.logger.warn(`Validator metadata refresh failed: ${(err as Error).message}`);
    }
  }

  /**
   * Fetch validator display names from Stakewiz. The endpoint returns the full
   * mainnet validator set; we filter to identities we already track. Failure
   * is non-fatal — names just stay as whatever's in the DB.
   */
  private async fetchValidatorNames(identitySet: Set<string>): Promise<Map<string, string>> {
    const map = new Map<string, string>();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);
    try {
      const res = await fetch(STAKEWIZ_VALIDATORS_URL, { signal: controller.signal });
      if (!res.ok) return map;
      const list = (await res.json()) as StakewizValidator[];
      for (const v of list) {
        if (identitySet.has(v.identity) && v.name) {
          const trimmed = v.name.trim();
          if (trimmed) map.set(v.identity, trimmed);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Stakewiz name fetch failed: ${message}`);
    } finally {
      clearTimeout(timeoutId);
    }
    return map;
  }

  /**
   * Update each validator's `leaderSlotsObserved` based on the Solana leader
   * schedule. We snapshot the current epoch's progress (slots assigned that
   * have already been completed) and persist it under
   * `leaderSlotsByEpoch[epoch]`. The cumulative running total across all
   * recorded epochs is kept in `leaderSlotsObserved`.
   *
   * - For the in-progress epoch, the count grows on each refresh as more
   *   leader slots complete.
   * - When the chain rolls over to the next epoch, the previous epoch's
   *   final count stays frozen and the new epoch starts at 0.
   * - We only count completed slots (slot offset <= current slotIndex) so
   *   the denominator never claims slots that haven't happened yet.
   */
  private async refreshLeaderSlots(rpcUrl: string, identitySet: Set<string>) {
    try {
      const epochInfo = await this.rpcCall<EpochInfo>(rpcUrl, 'getEpochInfo');
      if (!epochInfo) return;

      const { epoch, slotIndex, absoluteSlot } = epochInfo;
      const epochFirstSlot = absoluteSlot - slotIndex;

      // getLeaderSchedule(slotInEpoch) → schedule for the epoch that contains that slot
      const schedule = await this.rpcCall<LeaderSchedule>(rpcUrl, 'getLeaderSchedule', [
        epochFirstSlot,
      ]);
      if (!schedule) return;

      const validators = await this.prisma.validatorStats.findMany({
        where: { identity: { in: [...identitySet] } },
        select: { identity: true, leaderSlotsByEpoch: true },
      });

      let updated = 0;
      for (const v of validators) {
        const offsets = schedule[v.identity];
        if (!offsets || offsets.length === 0) continue;

        // Count how many of this validator's assigned slots have already
        // happened (offset <= slotIndex).
        let completedThisEpoch = 0;
        for (const off of offsets) {
          if (off <= slotIndex) completedThisEpoch++;
        }

        const byEpochRaw = (v.leaderSlotsByEpoch ?? {}) as Record<string, number>;
        const byEpoch: Record<string, number> = { ...byEpochRaw };

        if (byEpoch[String(epoch)] === completedThisEpoch) continue; // no change

        byEpoch[String(epoch)] = completedThisEpoch;
        const total = Object.values(byEpoch).reduce((a, b) => a + b, 0);

        await this.prisma.validatorStats.update({
          where: { identity: v.identity },
          data: {
            leaderSlotsByEpoch: byEpoch,
            leaderSlotsObserved: BigInt(total),
          },
        });
        updated++;
      }

      this.logger.log(
        `Refreshed leader slots (epoch ${epoch}, slotIndex ${slotIndex}) for ${updated} validators`,
      );
    } catch (err) {
      this.logger.warn(`Leader-slot refresh failed: ${(err as Error).message}`);
    }
  }

  private async rpcCall<T>(url: string, method: string, params?: unknown[]): Promise<T | null> {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method,
          params: params ?? [],
        }),
      });
      const data = await res.json();
      return data?.result ?? null;
    } catch {
      return null;
    }
  }
}
