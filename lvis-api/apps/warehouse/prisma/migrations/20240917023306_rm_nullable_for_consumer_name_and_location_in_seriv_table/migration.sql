/*
  Warnings:

  - Made the column `consumer_name` on table `seriv` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `seriv` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "seriv" ALTER COLUMN "consumer_name" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL;
