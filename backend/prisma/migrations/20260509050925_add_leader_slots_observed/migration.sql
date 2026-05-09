-- AlterTable
ALTER TABLE "validator_stats" ADD COLUMN     "leader_slots_by_epoch" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "leader_slots_observed" BIGINT NOT NULL DEFAULT 0;
