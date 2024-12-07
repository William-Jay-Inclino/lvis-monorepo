/*
  Warnings:

  - You are about to drop the column `status` on the `request_voucher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "request_voucher" DROP COLUMN "status",
ADD COLUMN     "approval_status" INTEGER;
