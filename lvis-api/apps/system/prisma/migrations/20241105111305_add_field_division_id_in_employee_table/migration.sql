-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "division_id" TEXT;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_division_id_fkey" FOREIGN KEY ("division_id") REFERENCES "division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
