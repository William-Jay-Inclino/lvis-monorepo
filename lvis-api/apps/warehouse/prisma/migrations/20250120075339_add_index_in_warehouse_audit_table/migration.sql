-- AlterTable
ALTER TABLE "warehouse_audit" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ;

-- CreateIndex
CREATE INDEX "warehouse_audit_username_idx" ON "warehouse_audit"("username");

-- CreateIndex
CREATE INDEX "warehouse_audit_table_idx" ON "warehouse_audit"("table");
