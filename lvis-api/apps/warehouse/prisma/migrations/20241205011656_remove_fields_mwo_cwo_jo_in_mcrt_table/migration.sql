/*
  Warnings:

  - You are about to drop the column `jo_number` on the `mcrt` table. All the data in the column will be lost.
  - You are about to drop the column `mo_number` on the `mcrt` table. All the data in the column will be lost.
  - You are about to drop the column `wo_number` on the `mcrt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mcrt" DROP COLUMN "jo_number",
DROP COLUMN "mo_number",
DROP COLUMN "wo_number";
