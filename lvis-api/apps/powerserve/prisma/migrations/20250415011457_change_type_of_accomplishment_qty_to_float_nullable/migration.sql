-- AlterTable
ALTER TABLE "task" ALTER COLUMN "accomplishment_qty" DROP NOT NULL,
ALTER COLUMN "accomplishment_qty" SET DATA TYPE DOUBLE PRECISION;
