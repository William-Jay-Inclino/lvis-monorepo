-- CreateTable
CREATE TABLE "system_audit" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "database" TEXT NOT NULL,
    "table" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reference_id" TEXT,
    "metadata" JSONB,
    "ip_address" TEXT,
    "device_info" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "system_audit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "system_audit_username_idx" ON "system_audit"("username");

-- CreateIndex
CREATE INDEX "system_audit_database_table_idx" ON "system_audit"("database", "table");
