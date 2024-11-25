/*
  Warnings:

  - A unique constraint covering the columns `[employee_number]` on the table `employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employee_number` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "employee_number" TEXT NOT NULL,
ADD COLUMN     "name_prefix" TEXT,
ADD COLUMN     "name_suffix" TEXT,
ADD COLUMN     "rank_number" INTEGER,
ADD COLUMN     "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE UNIQUE INDEX "employee_employee_number_key" ON "employee"("employee_number");
