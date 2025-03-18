/*
  Warnings:

  - A unique constraint covering the columns `[task_id]` on the table `task_assignment` will be added. If there are existing duplicate values, this will fail.
  - Made the column `complaint_id` on table `complaint_detail` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "complaint_detail" ALTER COLUMN "complaint_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "task_assignment_task_id_key" ON "task_assignment"("task_id");

-- AddForeignKey
ALTER TABLE "task_assignment" ADD CONSTRAINT "task_assignment_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
