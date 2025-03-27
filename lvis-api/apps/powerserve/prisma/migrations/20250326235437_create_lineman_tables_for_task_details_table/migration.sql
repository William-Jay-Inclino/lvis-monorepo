/*
  Warnings:

  - You are about to drop the column `lineman_incharge_id` on the `task_detail_dles` table. All the data in the column will be lost.
  - You are about to drop the column `lineman_incharge_id` on the `task_detail_kwh_meter` table. All the data in the column will be lost.
  - You are about to drop the column `lineman_incharge_id` on the `task_detail_line_services` table. All the data in the column will be lost.
  - You are about to drop the column `lineman_incharge_id` on the `task_detail_lmdga` table. All the data in the column will be lost.
  - You are about to drop the column `lineman_incharge_id` on the `task_detail_power_interruption` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "task_detail_dles" DROP CONSTRAINT "task_detail_dles_lineman_incharge_id_fkey";

-- DropForeignKey
ALTER TABLE "task_detail_kwh_meter" DROP CONSTRAINT "task_detail_kwh_meter_lineman_incharge_id_fkey";

-- DropForeignKey
ALTER TABLE "task_detail_line_services" DROP CONSTRAINT "task_detail_line_services_lineman_incharge_id_fkey";

-- DropForeignKey
ALTER TABLE "task_detail_lmdga" DROP CONSTRAINT "task_detail_lmdga_lineman_incharge_id_fkey";

-- DropForeignKey
ALTER TABLE "task_detail_power_interruption" DROP CONSTRAINT "task_detail_power_interruption_lineman_incharge_id_fkey";

-- AlterTable
ALTER TABLE "task_detail_dles" DROP COLUMN "lineman_incharge_id";

-- AlterTable
ALTER TABLE "task_detail_kwh_meter" DROP COLUMN "lineman_incharge_id";

-- AlterTable
ALTER TABLE "task_detail_line_services" DROP COLUMN "lineman_incharge_id";

-- AlterTable
ALTER TABLE "task_detail_lmdga" DROP COLUMN "lineman_incharge_id";

-- AlterTable
ALTER TABLE "task_detail_power_interruption" DROP COLUMN "lineman_incharge_id";

-- CreateTable
CREATE TABLE "power_interruption_lineman" (
    "id" SERIAL NOT NULL,
    "task_detail_id" INTEGER NOT NULL,
    "lineman_id" TEXT NOT NULL,

    CONSTRAINT "power_interruption_lineman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kwh_meter_lineman" (
    "id" SERIAL NOT NULL,
    "task_detail_id" INTEGER NOT NULL,
    "lineman_id" TEXT NOT NULL,

    CONSTRAINT "kwh_meter_lineman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "line_services_lineman" (
    "id" SERIAL NOT NULL,
    "task_detail_id" INTEGER NOT NULL,
    "lineman_id" TEXT NOT NULL,

    CONSTRAINT "line_services_lineman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dles_lineman" (
    "id" SERIAL NOT NULL,
    "task_detail_id" INTEGER NOT NULL,
    "lineman_id" TEXT NOT NULL,

    CONSTRAINT "dles_lineman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lmdga_lineman" (
    "id" SERIAL NOT NULL,
    "task_detail_id" INTEGER NOT NULL,
    "lineman_id" TEXT NOT NULL,

    CONSTRAINT "lmdga_lineman_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "power_interruption_lineman" ADD CONSTRAINT "power_interruption_lineman_task_detail_id_fkey" FOREIGN KEY ("task_detail_id") REFERENCES "task_detail_power_interruption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "power_interruption_lineman" ADD CONSTRAINT "power_interruption_lineman_lineman_id_fkey" FOREIGN KEY ("lineman_id") REFERENCES "lineman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kwh_meter_lineman" ADD CONSTRAINT "kwh_meter_lineman_task_detail_id_fkey" FOREIGN KEY ("task_detail_id") REFERENCES "task_detail_kwh_meter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kwh_meter_lineman" ADD CONSTRAINT "kwh_meter_lineman_lineman_id_fkey" FOREIGN KEY ("lineman_id") REFERENCES "lineman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "line_services_lineman" ADD CONSTRAINT "line_services_lineman_task_detail_id_fkey" FOREIGN KEY ("task_detail_id") REFERENCES "task_detail_line_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "line_services_lineman" ADD CONSTRAINT "line_services_lineman_lineman_id_fkey" FOREIGN KEY ("lineman_id") REFERENCES "lineman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dles_lineman" ADD CONSTRAINT "dles_lineman_task_detail_id_fkey" FOREIGN KEY ("task_detail_id") REFERENCES "task_detail_dles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dles_lineman" ADD CONSTRAINT "dles_lineman_lineman_id_fkey" FOREIGN KEY ("lineman_id") REFERENCES "lineman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lmdga_lineman" ADD CONSTRAINT "lmdga_lineman_task_detail_id_fkey" FOREIGN KEY ("task_detail_id") REFERENCES "task_detail_lmdga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lmdga_lineman" ADD CONSTRAINT "lmdga_lineman_lineman_id_fkey" FOREIGN KEY ("lineman_id") REFERENCES "lineman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
