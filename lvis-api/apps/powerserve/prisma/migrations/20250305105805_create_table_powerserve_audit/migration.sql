-- CreateTable
CREATE TABLE "powerserve_audit" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "table" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reference_id" TEXT,
    "metadata" JSONB,
    "ip_address" TEXT,
    "device_info" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "powerserve_audit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "powerserve_audit_username_idx" ON "powerserve_audit"("username");

-- CreateIndex
CREATE INDEX "powerserve_audit_table_idx" ON "powerserve_audit"("table");
