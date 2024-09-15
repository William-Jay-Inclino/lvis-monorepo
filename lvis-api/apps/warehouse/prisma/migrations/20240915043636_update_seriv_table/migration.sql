/*
  Warnings:

  - You are about to drop the column `department_id` on the `seriv` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[seriv_item_id]` on the table `item_transaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seriv_id,label]` on the table `seriv_approver` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `warehouse_custodian_id` to the `seriv` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "item_transaction" ADD COLUMN     "seriv_item_id" TEXT;

-- AlterTable
ALTER TABLE "seriv" DROP COLUMN "department_id",
ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "warehouse_custodian_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "seriv_item" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "item_transaction_seriv_item_id_key" ON "item_transaction"("seriv_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "seriv_approver_seriv_id_label_key" ON "seriv_approver"("seriv_id", "label");

-- AddForeignKey
ALTER TABLE "item_transaction" ADD CONSTRAINT "item_transaction_seriv_item_id_fkey" FOREIGN KEY ("seriv_item_id") REFERENCES "seriv_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
