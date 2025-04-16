/*
  Warnings:

  - You are about to drop the column `cause` on the `task_detail_dles` table. All the data in the column will be lost.
  - You are about to drop the column `cause` on the `task_detail_kwh_meter` table. All the data in the column will be lost.
  - You are about to drop the column `cause` on the `task_detail_line_services` table. All the data in the column will be lost.
  - You are about to drop the column `cause` on the `task_detail_power_interruption` table. All the data in the column will be lost.
  - You are about to drop the `activity_category_causes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cause_id` to the `task_detail_dles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cause_id` to the `task_detail_kwh_meter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cause_id` to the `task_detail_line_services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cause_id` to the `task_detail_power_interruption` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "activity_category_causes" DROP CONSTRAINT "activity_category_causes_category_id_fkey";

-- AlterTable
ALTER TABLE "task_detail_dles" DROP COLUMN "cause",
ADD COLUMN     "cause_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "task_detail_kwh_meter" DROP COLUMN "cause",
ADD COLUMN     "cause_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "task_detail_line_services" DROP COLUMN "cause",
ADD COLUMN     "cause_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "task_detail_power_interruption" DROP COLUMN "cause",
ADD COLUMN     "cause_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "activity_category_causes";

-- CreateTable
CREATE TABLE "activity_category_cause" (
    "id" TEXT NOT NULL,
    "category_id" INTEGER,
    "code" TEXT,
    "name" TEXT NOT NULL,

    CONSTRAINT "activity_category_cause_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "activity_category_cause_code_key" ON "activity_category_cause"("code");

-- AddForeignKey
ALTER TABLE "activity_category_cause" ADD CONSTRAINT "activity_category_cause_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "activity_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_power_interruption" ADD CONSTRAINT "task_detail_power_interruption_cause_id_fkey" FOREIGN KEY ("cause_id") REFERENCES "activity_category_cause"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_kwh_meter" ADD CONSTRAINT "task_detail_kwh_meter_cause_id_fkey" FOREIGN KEY ("cause_id") REFERENCES "activity_category_cause"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_line_services" ADD CONSTRAINT "task_detail_line_services_cause_id_fkey" FOREIGN KEY ("cause_id") REFERENCES "activity_category_cause"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_dles" ADD CONSTRAINT "task_detail_dles_cause_id_fkey" FOREIGN KEY ("cause_id") REFERENCES "activity_category_cause"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
