-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'MESSAGE', 'ALERT');

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "notification_type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "is_seen" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMPTZ,
    "metadata" JSONB,
    "source_id" TEXT,
    "source_type" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_username_idx" ON "notifications"("username");

-- CreateIndex
CREATE INDEX "idx_notifications_unread" ON "notifications"("username", "is_read");

-- CreateIndex
CREATE INDEX "idx_notifications_created" ON "notifications"("created_at");
