/*
  Warnings:

  - Added the required column `exp_date` to the `mrv` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exp_date` to the `osriv` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exp_date` to the `seriv` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mrv" ADD COLUMN     "exp_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "osriv" ADD COLUMN     "exp_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "seriv" ADD COLUMN     "exp_date" TIMESTAMP(3) NOT NULL;
