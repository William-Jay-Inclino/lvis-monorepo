/*
  Warnings:

  - You are about to drop the column `label_id` on the `mcrt_approver` table. All the data in the column will be lost.
  - You are about to drop the column `label_id` on the `mct_approver` table. All the data in the column will be lost.
  - You are about to drop the column `label_id` on the `mrv_approver` table. All the data in the column will be lost.
  - You are about to drop the column `label_id` on the `mst_approver` table. All the data in the column will be lost.
  - You are about to drop the column `label_id` on the `osriv_approver` table. All the data in the column will be lost.
  - You are about to drop the column `label_id` on the `seriv_approver` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mcrt_id,order]` on the table `mcrt_approver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mct_id,order]` on the table `mct_approver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mrv_id,order]` on the table `mrv_approver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mst_id,order]` on the table `mst_approver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[osriv_id,order]` on the table `osriv_approver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seriv_id,order]` on the table `seriv_approver` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "mrv_approver_mrv_id_label_id_key";

-- DropIndex
DROP INDEX "osriv_approver_osriv_id_label_id_key";

-- DropIndex
DROP INDEX "seriv_approver_seriv_id_label_id_key";

-- AlterTable
ALTER TABLE "mcrt_approver" DROP COLUMN "label_id";

-- AlterTable
ALTER TABLE "mct_approver" DROP COLUMN "label_id";

-- AlterTable
ALTER TABLE "mrv_approver" DROP COLUMN "label_id";

-- AlterTable
ALTER TABLE "mst_approver" DROP COLUMN "label_id";

-- AlterTable
ALTER TABLE "osriv_approver" DROP COLUMN "label_id";

-- AlterTable
ALTER TABLE "seriv_approver" DROP COLUMN "label_id";

-- CreateIndex
CREATE UNIQUE INDEX "mcrt_approver_mcrt_id_order_key" ON "mcrt_approver"("mcrt_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "mct_approver_mct_id_order_key" ON "mct_approver"("mct_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "mrv_approver_mrv_id_order_key" ON "mrv_approver"("mrv_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "mst_approver_mst_id_order_key" ON "mst_approver"("mst_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "osriv_approver_osriv_id_order_key" ON "osriv_approver"("osriv_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "seriv_approver_seriv_id_order_key" ON "seriv_approver"("seriv_id", "order");
