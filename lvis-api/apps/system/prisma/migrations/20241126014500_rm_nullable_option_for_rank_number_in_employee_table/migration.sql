/*
  Warnings:

  - Made the column `rank_number` on table `employee` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "employee" ALTER COLUMN "rank_number" SET NOT NULL;
