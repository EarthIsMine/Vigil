import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ChildProcess, spawn } from 'child_process';
import { createInterface } from 'readline';
import { PrismaService } from '../prisma/prisma.service';
import { PriceService } from '../price/price.service';
import { TransformService } from './transform.service';
import { EventsGateway } from '../gateway/events.gateway';
import {
  parseDetectorLine,
  SandwichAttack,
  JsonlHeader,
  JsonlHeartbeat,
  EnrichmentMetrics,
  DexType,
} from './detector.types';

@Injectable()
export class DetectorService implements OnModuleInit, OnModuleDestroy {
  private process: ChildProcess | null = null;
  private readonly logger = new Logger(DetectorService.name);
  private stopping = false;
  private lastHeartbeat: number = 0;

  constructor(
    private readonly prisma: PrismaService,
    private readonly price: PriceService,
    private readonly transform: TransformService,
    private readonly gateway: EventsGateway,
  ) {}

  onModuleInit() {
    this.spawn();
  }

  onModuleDestroy() {
    this.stopping = true;
    this.process?.kill('SIGTERM');
    this.process = null;
  }

  /** Expose for health-check endpoint */
  getLastHeartbeat(): number {
    return this.lastHeartbeat;
  }

  private spawn() {
    const rpcUrl = process.env.HELIUS_RPC_URL ?? process.env.RPC_URL;
    if (!rpcUrl) {
      this.logger.warn('No RPC_URL or HELIUS_RPC_URL set — detector will not start');
      return;
    }

    const binaryPath = process.env.DETECTOR_BIN ?? 'sandwich-detect';
    const concurrency = process.env.DETECTOR_CONCURRENCY ?? '32';
    const window = process.env.DETECTOR_WINDOW ?? '5';

    const args = [
      '--rpc', rpcUrl,
      '--follow',
      '--format', 'json',
      '--window', window,
      '--concurrency', concurrency,
      '--heartbeat-secs', '30',
      '--evidence-mode', 'passing',
    ];

    // Optional: separate archival RPC for pool-state enrichment
    const poolStateRpc = process.env.POOL_STATE_RPC;
    if (poolStateRpc) {
      args.push('--pool-state', poolStateRpc);
    }

    this.logger.log(`Spawning detector: ${binaryPath} ${args.join(' ')}`);

    this.process = spawn(binaryPath, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, RUST_LOG: process.env.RUST_LOG ?? 'info' },
    });

    const rl = createInterface({ input: this.process.stdout! });
    rl.on('line', (line) => this.handleLine(line));

    this.process.stderr?.on('data', (chunk) => {
      this.logger.debug(`detector: ${chunk.toString().trim()}`);
    });

    this.process.on('exit', (code, signal) => {
      if (this.stopping) return;
      this.logger.warn(`Detector exited code=${code} signal=${signal}; respawning in 5s`);
      setTimeout(() => this.spawn(), 5000);
    });

    this.process.on('error', (err) => {
      this.logger.error(`Detector spawn error: ${err.message}`);
    });
  }

  private async handleLine(raw: string) {
    try {
      const parsed = parseDetectorLine(raw);

      if ('_header' in parsed) {
        const header = parsed as JsonlHeader;
        // §13: reject unknown schema versions
        if (header.schema_version !== 'vigil-v1') {
          this.logger.error(
            `Unknown schema version "${header.schema_version}" — expected "vigil-v1". Stopping.`,
          );
          this.process?.kill('SIGTERM');
          return;
        }
        this.logger.log(
          `Detector connected: schema=${header.schema_version}, version=${header.tool_version}`,
        );
        return;
      }

      if ('_heartbeat' in parsed) {
        this.lastHeartbeat = Date.now();
        this.handleHeartbeat(parsed as JsonlHeartbeat);
        return;
      }

      // SandwichAttack
      await this.ingestAttack(parsed as SandwichAttack);
    } catch (err) {
      this.logger.error(`Failed to process line: ${(err as Error).message}`);
    }
  }

  private handleHeartbeat(hb: JsonlHeartbeat) {
    // §1: per-DexType bucket metrics
    const metrics = hb.metrics as EnrichmentMetrics;
    const totalEnriched = Object.values(metrics).reduce((s, b) => s + b.enriched, 0);
    const totalCrossBoundary = Object.values(metrics).reduce(
      (s, b) => s + b.cross_boundary_unsupported, 0,
    );
    this.logger.debug(
      `Heartbeat: enriched=${totalEnriched}, cross_boundary=${totalCrossBoundary}`,
    );
  }

  private async ingestAttack(attack: SandwichAttack) {
    const solPrice = this.price.getSolUsd();
    const { dbAttack, dbSandwichDetail, dbReceipts, frontendPayload } =
      this.transform.transform(attack, solPrice);

    try {
      await this.prisma.$transaction(async (tx) => {
        // Upsert attack (dedup via signature UNIQUE — §8)
        await tx.mevAttack.upsert({
          where: { signature: dbAttack.signature },
          create: dbAttack,
          update: {}, // same data, no-op on duplicate
        });

        // Create sandwich detail
        if (dbSandwichDetail) {
          await tx.sandwichDetail.upsert({
            where: { attackSignature: dbSandwichDetail.attackSignature },
            create: dbSandwichDetail,
            update: {},
          });
        }

        // Create receipts
        if (dbReceipts.length > 0) {
          for (const r of dbReceipts) {
            await tx.mevReceipt.upsert({
              where: { victimTxSignature: r.victimTxSignature },
              create: r,
              update: {},
            });
          }
        }

        // Upsert validator stats. Note: slot-level counters (totalSlotsSeen,
        // slotsWithSandwich, slotsWithWideSandwich) are no longer maintained
        // here. The validator service now derives those from MevAttack rows
        // (distinct slots) divided by leaderSlotsObserved (populated by
        // ValidatorMetaService from getLeaderSchedule).
        if (attack.slot_leader) {
          const loss = attack.victim_loss_lamports;
          await tx.validatorStats.upsert({
            where: { identity: attack.slot_leader },
            create: {
              identity: attack.slot_leader,
              totalExtractedLamports: loss ?? 0,
              totalAttacksInSlots: 1,
            },
            update: {
              ...(loss != null && { totalExtractedLamports: { increment: loss } }),
              totalAttacksInSlots: { increment: 1 },
            },
          });
        }

        // Upsert pool stats. When solPrice is unavailable (boot window or
        // CoinGecko outage), accumulate SOL only — totalLossUsd stays a lower
        // bound rather than being synthesized from a stale fallback.
        const lossLamports = attack.victim_loss_lamports;
        const lossUsd =
          lossLamports != null && solPrice != null
            ? (lossLamports / 1e9) * solPrice
            : null;

        await tx.poolStats.upsert({
          where: { pool: attack.pool },
          create: {
            pool: attack.pool,
            dex: attack.dex,
            attackCount: 1,
            totalLossLamports: lossLamports ?? 0,
            totalLossUsd: lossUsd ?? 0,
            lastAttackAt: new Date(frontendPayload.timestamp),
          },
          update: {
            attackCount: { increment: 1 },
            ...(lossLamports != null && {
              totalLossLamports: { increment: lossLamports },
              ...(lossUsd != null && { totalLossUsd: { increment: lossUsd } }),
            }),
            lastAttackAt: new Date(frontendPayload.timestamp),
          },
        });
      });

      // Broadcast to WebSocket clients
      this.gateway.broadcastAttack(frontendPayload);

      const lossDisplay = frontendPayload.extractedUsd != null
        ? `$${frontendPayload.extractedUsd.toFixed(2)}`
        : 'unenriched';
      this.logger.debug(
        `Ingested: slot=${attack.slot} dex=${attack.dex} loss=${lossDisplay}`,
      );
    } catch (err) {
      this.logger.error(`DB write failed: ${(err as Error).message}`);
    }
  }
}
