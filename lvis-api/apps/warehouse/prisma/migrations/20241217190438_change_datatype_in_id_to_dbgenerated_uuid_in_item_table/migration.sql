/*
  Warnings:

  - The `item_id` column on the `canvass_item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `item_id` column on the `project_item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `item_id` on the `item_location` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `item_id` on the `item_transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `item_id` on the `mcrt_item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `item_id` on the `mrv_item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `item_id` on the `mst_item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `item_id` on the `osriv_item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `item_id` on the `seriv_item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- DropForeignKey
ALTER TABLE "canvass_item" DROP CONSTRAINT "canvass_item_item_id_fkey";

-- DropForeignKey
ALTER TABLE "item_location" DROP CONSTRAINT "item_location_item_id_fkey";

-- DropForeignKey
ALTER TABLE "item_transaction" DROP CONSTRAINT "item_transaction_item_id_fkey";

-- DropForeignKey
ALTER TABLE "mcrt_item" DROP CONSTRAINT "mcrt_item_item_id_fkey";

-- DropForeignKey
ALTER TABLE "mrv_item" DROP CONSTRAINT "mrv_item_item_id_fkey";

-- DropForeignKey
ALTER TABLE "mst_item" DROP CONSTRAINT "mst_item_item_id_fkey";

-- DropForeignKey
ALTER TABLE "osriv_item" DROP CONSTRAINT "osriv_item_item_id_fkey";

-- DropForeignKey
ALTER TABLE "project_item" DROP CONSTRAINT "project_item_item_id_fkey";

-- DropForeignKey
ALTER TABLE "seriv_item" DROP CONSTRAINT "seriv_item_item_id_fkey";

-- AlterTable
ALTER TABLE "canvass_item" DROP COLUMN "item_id",
ADD COLUMN     "item_id" UUID;

-- AlterTable
ALTER TABLE "item" DROP CONSTRAINT "item_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "item_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "item_location" DROP COLUMN "item_id",
ADD COLUMN     "item_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "item_transaction" DROP COLUMN "item_id",
ADD COLUMN     "item_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "mcrt_item" DROP COLUMN "item_id",
ADD COLUMN     "item_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "mrv_item" DROP COLUMN "item_id",
ADD COLUMN     "item_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "mst_item" DROP COLUMN "item_id",
ADD COLUMN     "item_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "osriv_item" DROP COLUMN "item_id",
ADD COLUMN     "item_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "project_item" DROP COLUMN "item_id",
ADD COLUMN     "item_id" UUID;

-- AlterTable
ALTER TABLE "seriv_item" DROP COLUMN "item_id",
ADD COLUMN     "item_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "canvass_item_canvass_id_unit_id_item_id_idx" ON "canvass_item"("canvass_id", "unit_id", "item_id");

-- CreateIndex
CREATE INDEX "item_transaction_item_id_idx" ON "item_transaction"("item_id");

-- CreateIndex
CREATE INDEX "mcrt_item_mcrt_id_item_id_idx" ON "mcrt_item"("mcrt_id", "item_id");

-- CreateIndex
CREATE INDEX "mrv_item_mrv_id_item_id_idx" ON "mrv_item"("mrv_id", "item_id");

-- CreateIndex
CREATE INDEX "mst_item_mst_id_item_id_idx" ON "mst_item"("mst_id", "item_id");

-- CreateIndex
CREATE INDEX "osriv_item_osriv_id_item_id_idx" ON "osriv_item"("osriv_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_item_item_id_key" ON "project_item"("item_id");

-- CreateIndex
CREATE INDEX "seriv_item_seriv_id_item_id_idx" ON "seriv_item"("seriv_id", "item_id");

-- AddForeignKey
ALTER TABLE "project_item" ADD CONSTRAINT "project_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_location" ADD CONSTRAINT "item_location_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_transaction" ADD CONSTRAINT "item_transaction_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canvass_item" ADD CONSTRAINT "canvass_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osriv_item" ADD CONSTRAINT "osriv_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seriv_item" ADD CONSTRAINT "seriv_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mrv_item" ADD CONSTRAINT "mrv_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mcrt_item" ADD CONSTRAINT "mcrt_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mst_item" ADD CONSTRAINT "mst_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
