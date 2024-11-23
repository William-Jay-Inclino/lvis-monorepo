/*
  Warnings:

  - You are about to drop the column `supervisor_id` on the `spare_parts_request` table. All the data in the column will be lost.
  - You are about to drop the column `is_supervisor` on the `spr_approver` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[spr_id,order]` on the table `spr_approver` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "spare_parts_request" DROP COLUMN "supervisor_id";

-- AlterTable
ALTER TABLE "spr_approver" DROP COLUMN "is_supervisor";

-- CreateIndex
CREATE UNIQUE INDEX "spr_approver_spr_id_order_key" ON "spr_approver"("spr_id", "order");
