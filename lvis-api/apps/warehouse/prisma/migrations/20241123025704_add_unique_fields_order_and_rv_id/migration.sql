/*
  Warnings:

  - A unique constraint covering the columns `[rv_id,order]` on the table `rv_approver` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "rv_approver_rv_id_order_key" ON "rv_approver"("rv_id", "order");
