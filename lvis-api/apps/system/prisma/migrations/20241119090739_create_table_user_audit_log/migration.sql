-- CreateEnum
CREATE TYPE "UserLogEventType" AS ENUM ('LOGIN', 'LOGOUT');

-- CreateTable
CREATE TABLE "user_audit_log" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_type" "UserLogEventType" NOT NULL,
    "event_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT NOT NULL,
    "device_info" JSONB,

    CONSTRAINT "user_audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_audit_log_user_id_idx" ON "user_audit_log"("user_id");

-- AddForeignKey
ALTER TABLE "user_audit_log" ADD CONSTRAINT "user_audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
