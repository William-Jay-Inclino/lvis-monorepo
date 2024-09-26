/*
  Warnings:

  - You are about to drop the column `supervisor_id` on the `osriv` table. All the data in the column will be lost.
  - You are about to drop the column `warehouse_custodian_id` on the `osriv` table. All the data in the column will be lost.
  - You are about to drop the column `is_supervisor` on the `osriv_approver` table. All the data in the column will be lost.
  - You are about to drop the column `is_warehouse_custodian` on the `osriv_approver` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[osriv_id,label_id]` on the table `osriv_approver` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `label_id` to the `osriv_approver` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "osriv" DROP COLUMN "supervisor_id",
DROP COLUMN "warehouse_custodian_id";

-- AlterTable
ALTER TABLE "osriv_approver" DROP COLUMN "is_supervisor",
DROP COLUMN "is_warehouse_custodian",
ADD COLUMN     "label_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "osriv_approver_osriv_id_label_id_key" ON "osriv_approver"("osriv_id", "label_id");
