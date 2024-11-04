-- AlterTable
ALTER TABLE "gas_slip" ALTER COLUMN "is_posted" DROP NOT NULL,
ALTER COLUMN "is_posted" DROP DEFAULT;
