-- AddForeignKey
ALTER TABLE "task_detail_lmdga" ADD CONSTRAINT "task_detail_lmdga_feeder_id_fkey" FOREIGN KEY ("feeder_id") REFERENCES "feeder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
