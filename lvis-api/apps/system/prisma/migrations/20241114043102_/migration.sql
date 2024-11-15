/*
  Warnings:

  - You are about to drop the `position` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_position_id_fkey";

-- AlterTable
ALTER TABLE "division" ADD COLUMN     "permissions" JSONB;

-- DropTable
DROP TABLE "position";
