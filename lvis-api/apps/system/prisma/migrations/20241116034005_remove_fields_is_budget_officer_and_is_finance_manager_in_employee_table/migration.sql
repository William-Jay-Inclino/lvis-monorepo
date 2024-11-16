/*
  Warnings:

  - You are about to drop the column `is_budget_officer` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `is_finance_manager` on the `employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "employee" DROP COLUMN "is_budget_officer",
DROP COLUMN "is_finance_manager";
