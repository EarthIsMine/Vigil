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
      const [voteAccounts, clusterNodes] = await Promise.all([
        this.rpcCall<{ current: VoteAccountInfo[]; delinquent: VoteAccountInfo[] }>(
          rpcUrl, 'getVoteAccounts',
        ),
        this.rpcCall<ClusterNode[]>(rpcUrl, 'getClusterNodes'),
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

        if (!va && !client) continue;

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
          },
        });
        updated++;
      }

      this.logger.log(`Updated ${updated} validator metadata from RPC`);
    } catch (err) {
      this.logger.warn(`Validator metadata refresh failed: ${(err as Error).message}`);
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
