/*
  Warnings:

  - A unique constraint covering the columns `[reference_number,reference_table]` on the table `pending` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "pending_approver_id_reference_number_reference_table_key";

-- CreateIndex
CREATE UNIQUE INDEX "pending_reference_number_reference_table_key" ON "pending"("reference_number", "reference_table");
