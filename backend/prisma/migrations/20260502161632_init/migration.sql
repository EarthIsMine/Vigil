-- CreateTable
CREATE TABLE "mev_attacks" (
    "id" SERIAL NOT NULL,
    "signature" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "slot" BIGINT NOT NULL,
    "timestamp_ms" BIGINT,
    "severity" TEXT,
    "attacker" TEXT NOT NULL,
    "dex" TEXT NOT NULL,
    "pool" TEXT NOT NULL,
    "leader_identity" TEXT,
    "victim_signer" TEXT NOT NULL,
    "victim_amount_in" DOUBLE PRECISION NOT NULL,
    "victim_amount_out" DOUBLE PRECISION NOT NULL,
    "victim_expected_amount_out" DOUBLE PRECISION,
    "victim_loss_lamports" DOUBLE PRECISION,
    "victim_loss_lamports_lower" DOUBLE PRECISION,
    "victim_loss_lamports_upper" DOUBLE PRECISION,
    "attacker_profit" DOUBLE PRECISION,
    "price_impact_bps" INTEGER,
    "bundle_provenance" TEXT,
    "confidence" DOUBLE PRECISION,
    "confidence_level" TEXT,
    "detection_method" JSONB,
    "evidence" JSONB,
    "amm_replay" JSONB,
    "whirlpool_replay" JSONB,
    "dlmm_replay" JSONB,
    "extracted_sol" DOUBLE PRECISION,
    "extracted_usd" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mev_attacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sandwich_details" (
    "id" SERIAL NOT NULL,
    "attack_signature" TEXT NOT NULL,
    "frontrun_tx" TEXT NOT NULL,
    "backrun_tx" TEXT NOT NULL,
    "attacker_profit" DOUBLE PRECISION,
    "frontrun_slot" BIGINT,
    "backrun_slot" BIGINT,
    "is_wide_sandwich" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sandwich_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mev_receipts" (
    "id" SERIAL NOT NULL,
    "victim_tx_signature" TEXT NOT NULL,
    "attack_signature" TEXT NOT NULL,
    "timestamp_ms" BIGINT,
    "victim_wallet" TEXT NOT NULL,
    "victim_action" TEXT NOT NULL,
    "victim_dex" TEXT NOT NULL,
    "token_in_mint" TEXT,
    "token_out_mint" TEXT,
    "amount_in" DOUBLE PRECISION NOT NULL,
    "expected_amount_out" DOUBLE PRECISION,
    "actual_amount_out" DOUBLE PRECISION NOT NULL,
    "slippage" DOUBLE PRECISION,
    "mev_detected" BOOLEAN NOT NULL DEFAULT true,
    "mev_type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "loss_amount" DOUBLE PRECISION,
    "loss_amount_lower" DOUBLE PRECISION,
    "loss_amount_upper" DOUBLE PRECISION,
    "loss_percent" DOUBLE PRECISION,
    "loss_confidence" TEXT NOT NULL,
    "validator_identity" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mev_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validator_stats" (
    "id" SERIAL NOT NULL,
    "identity" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "vote_account" TEXT NOT NULL DEFAULT '',
    "client" TEXT NOT NULL DEFAULT '',
    "total_slots_seen" INTEGER NOT NULL DEFAULT 0,
    "slots_with_sandwich" INTEGER NOT NULL DEFAULT 0,
    "slots_with_wide_sandwich" INTEGER NOT NULL DEFAULT 0,
    "total_extracted_lamports" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_attacks_in_slots" INTEGER NOT NULL DEFAULT 0,
    "risk_score" DOUBLE PRECISION,
    "risk_level" TEXT NOT NULL DEFAULT 'unrated',
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "validator_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pool_stats" (
    "id" SERIAL NOT NULL,
    "pool" TEXT NOT NULL,
    "dex" TEXT NOT NULL,
    "attack_count" INTEGER NOT NULL DEFAULT 0,
    "total_loss_lamports" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_loss_usd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "last_attack_at" TIMESTAMP(3),
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pool_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mev_attacks_signature_key" ON "mev_attacks"("signature");

-- CreateIndex
CREATE INDEX "mev_attacks_slot_idx" ON "mev_attacks"("slot");

-- CreateIndex
CREATE INDEX "mev_attacks_timestamp_ms_idx" ON "mev_attacks"("timestamp_ms");

-- CreateIndex
CREATE INDEX "mev_attacks_attacker_idx" ON "mev_attacks"("attacker");

-- CreateIndex
CREATE INDEX "mev_attacks_victim_signer_idx" ON "mev_attacks"("victim_signer");

-- CreateIndex
CREATE INDEX "mev_attacks_pool_idx" ON "mev_attacks"("pool");

-- CreateIndex
CREATE INDEX "mev_attacks_leader_identity_idx" ON "mev_attacks"("leader_identity");

-- CreateIndex
CREATE INDEX "mev_attacks_dex_idx" ON "mev_attacks"("dex");

-- CreateIndex
CREATE UNIQUE INDEX "sandwich_details_attack_signature_key" ON "sandwich_details"("attack_signature");

-- CreateIndex
CREATE UNIQUE INDEX "mev_receipts_victim_tx_signature_key" ON "mev_receipts"("victim_tx_signature");

-- CreateIndex
CREATE INDEX "mev_receipts_victim_wallet_idx" ON "mev_receipts"("victim_wallet");

-- CreateIndex
CREATE INDEX "mev_receipts_timestamp_ms_idx" ON "mev_receipts"("timestamp_ms");

-- CreateIndex
CREATE INDEX "mev_receipts_attack_signature_idx" ON "mev_receipts"("attack_signature");

-- CreateIndex
CREATE UNIQUE INDEX "validator_stats_identity_key" ON "validator_stats"("identity");

-- CreateIndex
CREATE UNIQUE INDEX "pool_stats_pool_key" ON "pool_stats"("pool");

-- CreateIndex
CREATE INDEX "pool_stats_attack_count_idx" ON "pool_stats"("attack_count" DESC);

-- AddForeignKey
ALTER TABLE "sandwich_details" ADD CONSTRAINT "sandwich_details_attack_signature_fkey" FOREIGN KEY ("attack_signature") REFERENCES "mev_attacks"("signature") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mev_receipts" ADD CONSTRAINT "mev_receipts_attack_signature_fkey" FOREIGN KEY ("attack_signature") REFERENCES "mev_attacks"("signature") ON DELETE RESTRICT ON UPDATE CASCADE;
