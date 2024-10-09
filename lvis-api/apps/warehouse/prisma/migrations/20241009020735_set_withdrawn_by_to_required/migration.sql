/*
  Warnings:

  - Made the column `withdrawn_by_id` on table `mrv` required. This step will fail if there are existing NULL values in that column.
  - Made the column `withdrawn_by_id` on table `seriv` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "mrv" ALTER COLUMN "withdrawn_by_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "seriv" ALTER COLUMN "withdrawn_by_id" SET NOT NULL;
