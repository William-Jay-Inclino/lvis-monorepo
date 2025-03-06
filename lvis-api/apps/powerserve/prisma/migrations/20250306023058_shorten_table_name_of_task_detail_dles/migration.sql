/*
  Warnings:

  - You are about to drop the `task_detail_distribution_line_equipment_services` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "task_detail_distribution_line_equipment_services" DROP CONSTRAINT "task_detail_distribution_line_equipment_services_lineman_i_fkey";

-- DropForeignKey
ALTER TABLE "task_detail_distribution_line_equipment_services" DROP CONSTRAINT "task_detail_distribution_line_equipment_services_task_id_fkey";

-- DropTable
DROP TABLE "task_detail_distribution_line_equipment_services";

-- CreateTable
CREATE TABLE "task_detail_dles" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "lineman_incharge_id" TEXT NOT NULL,
    "distance_travel_in_km" INTEGER NOT NULL,
    "sco_number" TEXT NOT NULL,
    "old_serial_number" TEXT NOT NULL,
    "new_serial_number" TEXT NOT NULL,
    "seriv_number" TEXT NOT NULL,
    "kva_rating" TEXT NOT NULL,
    "cause" TEXT NOT NULL,

    CONSTRAINT "task_detail_dles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "task_detail_dles_task_id_key" ON "task_detail_dles"("task_id");

-- AddForeignKey
ALTER TABLE "task_detail_dles" ADD CONSTRAINT "task_detail_dles_lineman_incharge_id_fkey" FOREIGN KEY ("lineman_incharge_id") REFERENCES "lineman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_dles" ADD CONSTRAINT "task_detail_dles_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
