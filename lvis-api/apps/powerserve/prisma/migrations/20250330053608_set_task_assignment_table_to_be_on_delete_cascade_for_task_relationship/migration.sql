-- DropForeignKey
ALTER TABLE "task_assignment" DROP CONSTRAINT "task_assignment_task_id_fkey";

-- AddForeignKey
ALTER TABLE "task_assignment" ADD CONSTRAINT "task_assignment_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
