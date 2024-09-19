-- AddForeignKey
ALTER TABLE "mrv" ADD CONSTRAINT "mrv_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
