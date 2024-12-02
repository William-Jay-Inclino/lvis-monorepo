-- AlterTable
ALTER TABLE "item" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "supplier" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "vehicle" ADD COLUMN     "deleted_at" TIMESTAMP(3);
