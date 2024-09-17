/*
  Warnings:

  - Made the column `jo_number` on table `seriv` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "seriv" ALTER COLUMN "jo_number" SET NOT NULL;
