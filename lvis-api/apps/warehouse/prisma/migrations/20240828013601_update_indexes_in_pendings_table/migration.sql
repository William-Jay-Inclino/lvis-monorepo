-- DropIndex
DROP INDEX "pending_approver_id_transaction_date_idx";

-- CreateIndex
CREATE INDEX "pending_reference_number_approver_id_reference_table_transa_idx" ON "pending"("reference_number", "approver_id", "reference_table", "transaction_date");
