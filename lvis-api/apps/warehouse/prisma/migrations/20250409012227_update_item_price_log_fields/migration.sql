/*
  Warnings:

  - You are about to drop the column `total_price` on the `item_price_log` table. All the data in the column will be lost.
  - You are about to drop the column `total_quantity` on the `item_price_log` table. All the data in the column will be lost.
  - Added the required column `beginning_price` to the `item_price_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prev_month_total_price` to the `item_price_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prev_month_total_qty` to the `item_price_log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "item_price_log" DROP COLUMN "total_price",
DROP COLUMN "total_quantity",
ADD COLUMN     "beginning_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "prev_month_total_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "prev_month_total_qty" DOUBLE PRECISION NOT NULL;
