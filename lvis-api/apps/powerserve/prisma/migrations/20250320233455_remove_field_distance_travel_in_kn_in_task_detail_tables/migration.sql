/*
  Warnings:

  - You are about to drop the column `distance_travel_in_km` on the `task_detail_dles` table. All the data in the column will be lost.
  - You are about to drop the column `distance_travel_in_km` on the `task_detail_kwh_meter` table. All the data in the column will be lost.
  - You are about to drop the column `distance_travel_in_km` on the `task_detail_line_services` table. All the data in the column will be lost.
  - You are about to drop the column `distance_travel_in_km` on the `task_detail_lmdga` table. All the data in the column will be lost.
  - You are about to drop the column `distance_travel_in_km` on the `task_detail_power_interruption` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "task_detail_dles" DROP COLUMN "distance_travel_in_km";

-- AlterTable
ALTER TABLE "task_detail_kwh_meter" DROP COLUMN "distance_travel_in_km";

-- AlterTable
ALTER TABLE "task_detail_line_services" DROP COLUMN "distance_travel_in_km";

-- AlterTable
ALTER TABLE "task_detail_lmdga" DROP COLUMN "distance_travel_in_km";

-- AlterTable
ALTER TABLE "task_detail_power_interruption" DROP COLUMN "distance_travel_in_km";
