/*
  Warnings:

  - Changed the type of `request_type` on the `seriv` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "seriv" DROP COLUMN "request_type",
ADD COLUMN     "request_type" INTEGER NOT NULL;
