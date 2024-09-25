/*
  Warnings:

  - A unique constraint covering the columns `[mcrt_item_id]` on the table `item_transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "item_transaction" ADD COLUMN     "mcrt_item_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "item_transaction_mcrt_item_id_key" ON "item_transaction"("mcrt_item_id");

-- AddForeignKey
ALTER TABLE "item_transaction" ADD CONSTRAINT "item_transaction_mcrt_item_id_fkey" FOREIGN KEY ("mcrt_item_id") REFERENCES "mcrt_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
