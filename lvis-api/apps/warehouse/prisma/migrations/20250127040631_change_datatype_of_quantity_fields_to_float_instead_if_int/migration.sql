-- AlterTable
ALTER TABLE "item" ALTER COLUMN "total_quantity" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "quantity_on_queue" SET DEFAULT 0,
ALTER COLUMN "quantity_on_queue" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "item_location" ALTER COLUMN "quantity_on_hand" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "item_movement" ALTER COLUMN "quantity_moved" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "item_transaction" ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "mcrt_item" ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "mrv_item" ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "mst_item" ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "osriv_item" ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "rr_item" ALTER COLUMN "quantity_accepted" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "seriv_item" ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;
