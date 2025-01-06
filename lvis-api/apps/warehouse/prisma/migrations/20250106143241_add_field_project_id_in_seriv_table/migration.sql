-- AlterTable
ALTER TABLE "seriv" ADD COLUMN     "project_id" UUID;

-- AddForeignKey
ALTER TABLE "seriv" ADD CONSTRAINT "seriv_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
