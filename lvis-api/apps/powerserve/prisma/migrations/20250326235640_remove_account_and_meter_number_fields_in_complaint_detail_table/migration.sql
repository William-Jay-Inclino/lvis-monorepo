/*
  Warnings:

  - You are about to drop the column `account_number` on the `complaint_detail` table. All the data in the column will be lost.
  - You are about to drop the column `meter_number` on the `complaint_detail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "complaint_detail" DROP COLUMN "account_number",
DROP COLUMN "meter_number";
