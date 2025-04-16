/*
  Warnings:

  - Added the required column `cause` to the `task_detail_kwh_meter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "task_detail_kwh_meter" ADD COLUMN     "cause" TEXT NOT NULL;
