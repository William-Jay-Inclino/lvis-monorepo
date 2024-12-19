-- AlterTable
ALTER TABLE "project" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "trip_ticket" ALTER COLUMN "start_time" SET DATA TYPE TIMESTAMPTZ;
