/*
  Warnings:

  - Added the required column `canvass_number` to the `job_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canvass_number` to the `request_voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `canvass_number` to the `spare_parts_request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job_order" ADD COLUMN     "canvass_number" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "request_voucher" ADD COLUMN     "canvass_number" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "spare_parts_request" ADD COLUMN     "canvass_number" TEXT NOT NULL;
