-- AlterTable
ALTER TABLE "validator_stats" ADD COLUMN     "active_since_epoch" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "commission" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stake" BIGINT NOT NULL DEFAULT 0;
