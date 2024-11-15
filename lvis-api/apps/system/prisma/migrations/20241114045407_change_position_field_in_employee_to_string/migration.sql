/*
  Warnings:

  - You are about to drop the column `position_id` on the `employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "employee" DROP COLUMN "position_id",
ADD COLUMN     "position" TEXT;
