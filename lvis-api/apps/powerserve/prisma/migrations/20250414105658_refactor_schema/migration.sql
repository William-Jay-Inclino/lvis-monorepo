/*
  Warnings:

  - You are about to drop the column `accomplishment` on the `task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `activity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `device` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `weather_condition` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit_id` to the `activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accomplishment_qty` to the `task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barangay_id` to the `task_detail_dles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distance_travel_in_km` to the `task_detail_dles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barangay_id` to the `task_detail_kwh_meter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distance_travel_in_km` to the `task_detail_kwh_meter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barangay_id` to the `task_detail_line_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distance_travel_in_km` to the `task_detail_line_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barangay_id` to the `task_detail_lmdga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distance_travel_in_km` to the `task_detail_lmdga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barangay_id` to the `task_detail_power_interruption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distance_travel_in_km` to the `task_detail_power_interruption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `weather_condition` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "device_name_key";

-- DropIndex
DROP INDEX "weather_condition_name_key";

-- AlterTable
ALTER TABLE "activity" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "num_of_personnel" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unit_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "device" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "task" DROP COLUMN "accomplishment",
ADD COLUMN     "accomplishment_qty" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "task_detail_dles" ADD COLUMN     "barangay_id" TEXT NOT NULL,
ADD COLUMN     "distance_travel_in_km" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "task_detail_kwh_meter" ADD COLUMN     "barangay_id" TEXT NOT NULL,
ADD COLUMN     "distance_travel_in_km" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "task_detail_line_services" ADD COLUMN     "barangay_id" TEXT NOT NULL,
ADD COLUMN     "distance_travel_in_km" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "task_detail_lmdga" ADD COLUMN     "barangay_id" TEXT NOT NULL,
ADD COLUMN     "distance_travel_in_km" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "task_detail_power_interruption" ADD COLUMN     "barangay_id" TEXT NOT NULL,
ADD COLUMN     "distance_travel_in_km" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "weather_condition" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_category_causes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "activity_category_causes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "remarks" (
    "id" SERIAL NOT NULL,
    "min" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "remarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unit_name_key" ON "unit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "activity_category_causes_code_key" ON "activity_category_causes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_code_key" ON "equipment"("code");

-- CreateIndex
CREATE UNIQUE INDEX "activity_code_key" ON "activity"("code");

-- CreateIndex
CREATE UNIQUE INDEX "device_code_key" ON "device"("code");

-- CreateIndex
CREATE UNIQUE INDEX "weather_condition_code_key" ON "weather_condition"("code");

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_power_interruption" ADD CONSTRAINT "task_detail_power_interruption_barangay_id_fkey" FOREIGN KEY ("barangay_id") REFERENCES "barangay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_kwh_meter" ADD CONSTRAINT "task_detail_kwh_meter_barangay_id_fkey" FOREIGN KEY ("barangay_id") REFERENCES "barangay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_line_services" ADD CONSTRAINT "task_detail_line_services_barangay_id_fkey" FOREIGN KEY ("barangay_id") REFERENCES "barangay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_dles" ADD CONSTRAINT "task_detail_dles_barangay_id_fkey" FOREIGN KEY ("barangay_id") REFERENCES "barangay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_lmdga" ADD CONSTRAINT "task_detail_lmdga_barangay_id_fkey" FOREIGN KEY ("barangay_id") REFERENCES "barangay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
