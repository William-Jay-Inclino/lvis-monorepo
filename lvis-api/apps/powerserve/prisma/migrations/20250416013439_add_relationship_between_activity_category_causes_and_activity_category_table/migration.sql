/*
  Warnings:

  - Added the required column `category_id` to the `activity_category_causes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activity_category_causes" ADD COLUMN     "category_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "task_detail_dles" ALTER COLUMN "distance_travel_in_km" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "task_detail_kwh_meter" ALTER COLUMN "distance_travel_in_km" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "task_detail_line_services" ALTER COLUMN "distance_travel_in_km" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "task_detail_lmdga" ALTER COLUMN "distance_travel_in_km" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "task_detail_power_interruption" ALTER COLUMN "distance_travel_in_km" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "activity_category_causes" ADD CONSTRAINT "activity_category_causes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "activity_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
