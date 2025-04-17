/*
  Warnings:

  - You are about to drop the column `equipment_failed` on the `task_detail_power_interruption` table. All the data in the column will be lost.
  - Added the required column `equipment_failed_id` to the `task_detail_power_interruption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task_detail_power_interruption" DROP COLUMN "equipment_failed",
ADD COLUMN     "equipment_failed_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "task_detail_power_interruption" ADD CONSTRAINT "task_detail_power_interruption_equipment_failed_id_fkey" FOREIGN KEY ("equipment_failed_id") REFERENCES "equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
