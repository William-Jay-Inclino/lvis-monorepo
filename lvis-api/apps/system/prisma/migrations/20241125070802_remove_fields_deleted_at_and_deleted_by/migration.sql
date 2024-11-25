/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `classification` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `classification` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `division` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `division` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "classification" DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by";

-- AlterTable
ALTER TABLE "department" DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by";

-- AlterTable
ALTER TABLE "division" DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by";

-- AlterTable
ALTER TABLE "employee" DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by";
