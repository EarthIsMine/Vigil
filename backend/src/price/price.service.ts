import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class PriceService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PriceService.name);
  private solUsd: number | null = null;
  private interval: NodeJS.Timeout;

  onModuleInit() {
    this.refresh();
    this.interval = setInterval(() => this.refresh(), 60_000);
  }

  onModuleDestroy() {
    clearInterval(this.interval);
  }

  getSolUsd(): number | null {
    return this.solUsd;
  }

  isReady(): boolean {
    return this.solUsd !== null;
  }

  private async refresh() {
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
      );
      const data = await res.json();
      if (data?.solana?.usd) {
        this.solUsd = data.solana.usd;
        this.logger.debug(`SOL/USD updated: $${this.solUsd}`);
      }
    } catch (err) {
      const display = this.solUsd != null ? `$${this.solUsd}` : 'unavailable';
      this.logger.warn(`Price fetch failed, keeping ${display}`);
    }
  }
}
