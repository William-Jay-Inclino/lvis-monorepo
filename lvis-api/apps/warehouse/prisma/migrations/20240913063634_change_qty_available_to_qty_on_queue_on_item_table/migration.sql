/*
  Warnings:

  - You are about to drop the column `available_quantity` on the `item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "item" DROP COLUMN "available_quantity",
ADD COLUMN     "quantity_on_queue" INTEGER NOT NULL DEFAULT 0;
