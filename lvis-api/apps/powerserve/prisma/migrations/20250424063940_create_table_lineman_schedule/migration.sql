/*
  Warnings:

  - Added the required column `general_shift_id` to the `lineman_schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lineman_schedule" ADD COLUMN     "general_shift_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "lineman_schedule_log" (
    "id" SERIAL NOT NULL,
    "lineman_id" TEXT NOT NULL,
    "general_shift" JSONB,
    "mon_shift" JSONB,
    "tue_shift" JSONB,
    "wed_shift" JSONB,
    "thu_shift" JSONB,
    "fri_shift" JSONB,
    "sat_shift" JSONB,
    "sun_shift" JSONB,
    "recorded_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recorded_by" TEXT,

    CONSTRAINT "lineman_schedule_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lineman_schedule_log_lineman_id_recorded_at_idx" ON "lineman_schedule_log"("lineman_id", "recorded_at");

-- AddForeignKey
ALTER TABLE "lineman_schedule" ADD CONSTRAINT "lineman_schedule_general_shift_id_fkey" FOREIGN KEY ("general_shift_id") REFERENCES "shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineman_schedule_log" ADD CONSTRAINT "lineman_schedule_log_lineman_id_fkey" FOREIGN KEY ("lineman_id") REFERENCES "lineman"("id") ON DELETE CASCADE ON UPDATE CASCADE;
