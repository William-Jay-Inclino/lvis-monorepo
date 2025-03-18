/*
  Warnings:

  - You are about to drop the column `broadcast_to_type` on the `complaint` table. All the data in the column will be lost.
  - Added the required column `broadcast_type` to the `complaint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "complaint" DROP COLUMN "broadcast_to_type",
ADD COLUMN     "broadcast_type" INTEGER NOT NULL;
