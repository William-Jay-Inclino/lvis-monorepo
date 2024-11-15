/*
  Warnings:

  - Made the column `position` on table `employee` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "employee" ALTER COLUMN "position" SET NOT NULL,
ALTER COLUMN "position" SET DEFAULT 'TBA';
