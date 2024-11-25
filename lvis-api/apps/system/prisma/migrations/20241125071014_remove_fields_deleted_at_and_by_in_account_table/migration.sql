/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "account" DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by";
