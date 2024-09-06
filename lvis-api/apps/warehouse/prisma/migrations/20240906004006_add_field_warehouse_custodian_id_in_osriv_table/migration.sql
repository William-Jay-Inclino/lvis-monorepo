/*
  Warnings:

  - Added the required column `warehouse_custodian_id` to the `osriv` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "osriv" ADD COLUMN     "warehouse_custodian_id" TEXT NOT NULL;
