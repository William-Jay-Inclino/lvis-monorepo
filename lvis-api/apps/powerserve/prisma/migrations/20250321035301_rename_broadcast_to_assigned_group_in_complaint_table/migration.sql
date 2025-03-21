/*
  Warnings:

  - You are about to drop the column `broadcast_to_id` on the `complaint` table. All the data in the column will be lost.
  - You are about to drop the column `broadcast_type` on the `complaint` table. All the data in the column will be lost.
  - Added the required column `assigned_group_id` to the `complaint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assigned_group_type` to the `complaint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "complaint" DROP COLUMN "broadcast_to_id",
DROP COLUMN "broadcast_type",
ADD COLUMN     "assigned_group_id" TEXT NOT NULL,
ADD COLUMN     "assigned_group_type" INTEGER NOT NULL;
