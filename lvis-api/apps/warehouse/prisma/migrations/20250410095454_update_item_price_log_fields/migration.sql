/*
  Warnings:

  - You are about to drop the column `prev_month_total_price` on the `item_price_log` table. All the data in the column will be lost.
  - You are about to drop the column `prev_month_total_qty` on the `item_price_log` table. All the data in the column will be lost.
  - Added the required column `beginning_quantity` to the `item_price_log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "item_price_log" DROP COLUMN "prev_month_total_price",
DROP COLUMN "prev_month_total_qty",
ADD COLUMN     "beginning_quantity" DOUBLE PRECISION NOT NULL;
