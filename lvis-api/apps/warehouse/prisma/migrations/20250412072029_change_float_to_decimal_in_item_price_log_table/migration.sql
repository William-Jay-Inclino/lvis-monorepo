/*
  Warnings:

  - You are about to alter the column `beginning_price` on the `item_price_log` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `beginning_quantity` on the `item_price_log` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.

*/
-- AlterTable
ALTER TABLE "item_price_log" ALTER COLUMN "beginning_price" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "beginning_quantity" SET DATA TYPE DECIMAL(12,2);
