-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "warehouse_audit" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "table" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "reference_id" TEXT,
    "metadata" JSONB,
    "ip_address" TEXT,
    "device_info" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "warehouse_audit_pkey" PRIMARY KEY ("id")
);
