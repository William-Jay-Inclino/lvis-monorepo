/*
  Warnings:

  - You are about to drop the column `is_supervisor` on the `jo_approver` table. All the data in the column will be lost.
  - You are about to drop the column `supervisor_id` on the `job_order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jo_id,order]` on the table `jo_approver` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "jo_approver" DROP COLUMN "is_supervisor";

-- AlterTable
ALTER TABLE "job_order" DROP COLUMN "supervisor_id";

-- CreateIndex
CREATE UNIQUE INDEX "jo_approver_jo_id_order_key" ON "jo_approver"("jo_id", "order");
