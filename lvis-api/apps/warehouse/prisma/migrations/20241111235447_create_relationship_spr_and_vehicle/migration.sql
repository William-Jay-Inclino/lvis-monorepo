-- AddForeignKey
ALTER TABLE "spare_parts_request" ADD CONSTRAINT "spare_parts_request_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
