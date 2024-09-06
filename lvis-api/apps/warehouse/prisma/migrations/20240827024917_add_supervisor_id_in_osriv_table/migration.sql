/*
  Warnings:

  - Added the required column `supervisor_id` to the `osriv` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "osriv" ADD COLUMN     "supervisor_id" TEXT NOT NULL;
