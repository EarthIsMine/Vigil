import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class PriceService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PriceService.name);
  private solUsd = 150; // sensible default
  private interval: NodeJS.Timeout;

  onModuleInit() {
    this.refresh();
    this.interval = setInterval(() => this.refresh(), 60_000);
  }

  onModuleDestroy() {
    clearInterval(this.interval);
  }

  getSolUsd(): number {
    return this.solUsd;
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
      this.logger.warn(`Price fetch failed, keeping $${this.solUsd}`);
    }
  }
}
