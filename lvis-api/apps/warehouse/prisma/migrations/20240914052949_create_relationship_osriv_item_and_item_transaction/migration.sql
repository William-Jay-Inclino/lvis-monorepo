/*
  Warnings:

  - A unique constraint covering the columns `[osriv_item_id]` on the table `item_transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "item_transaction" ADD COLUMN     "osriv_item_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "item_transaction_osriv_item_id_key" ON "item_transaction"("osriv_item_id");

-- AddForeignKey
ALTER TABLE "item_transaction" ADD CONSTRAINT "item_transaction_osriv_item_id_fkey" FOREIGN KEY ("osriv_item_id") REFERENCES "osriv_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
