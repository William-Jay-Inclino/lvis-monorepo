/*
  Warnings:

  - Added the required column `label_id` to the `mct_approver` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mct_approver" ADD COLUMN     "label_id" TEXT NOT NULL;
