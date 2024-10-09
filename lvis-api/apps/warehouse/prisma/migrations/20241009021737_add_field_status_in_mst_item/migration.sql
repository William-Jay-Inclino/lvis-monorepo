/*
  Warnings:

  - You are about to drop the column `status` on the `mst` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "mst" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "mst_item" ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;
