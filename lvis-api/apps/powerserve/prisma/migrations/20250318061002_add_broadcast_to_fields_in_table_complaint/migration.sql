/*
  Warnings:

  - Added the required column `broadcast_to_id` to the `complaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `broadcast_to_type` to the `complaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "complaint" ADD COLUMN     "broadcast_to_id" TEXT NOT NULL,
ADD COLUMN     "broadcast_to_type" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "task" ADD COLUMN     "description" TEXT NOT NULL;
