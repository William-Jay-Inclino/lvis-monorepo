-- DropForeignKey
ALTER TABLE "mrv" DROP CONSTRAINT "mrv_item_from_id_fkey";

-- DropForeignKey
ALTER TABLE "osriv" DROP CONSTRAINT "osriv_item_from_id_fkey";

-- DropForeignKey
ALTER TABLE "seriv" DROP CONSTRAINT "seriv_item_from_id_fkey";

-- AddForeignKey
ALTER TABLE "osriv" ADD CONSTRAINT "osriv_item_from_id_fkey" FOREIGN KEY ("item_from_id") REFERENCES "station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seriv" ADD CONSTRAINT "seriv_item_from_id_fkey" FOREIGN KEY ("item_from_id") REFERENCES "station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mrv" ADD CONSTRAINT "mrv_item_from_id_fkey" FOREIGN KEY ("item_from_id") REFERENCES "station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
