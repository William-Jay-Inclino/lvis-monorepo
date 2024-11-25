/*
  Warnings:

  - You are about to drop the column `created_by` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `classification` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `classification` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `classification` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `division` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `division` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `division` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `jo_approver_setting` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `jo_approver_setting` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `jo_approver_setting` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `meqs_approver_setting` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `meqs_approver_setting` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `meqs_approver_setting` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `po_approver_setting` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `po_approver_setting` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `po_approver_setting` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `rr_approver_setting` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `rr_approver_setting` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `rr_approver_setting` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `rv_approver_setting` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `rv_approver_setting` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `rv_approver_setting` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `spr_approver_setting` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `spr_approver_setting` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `spr_approver_setting` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `user_employee` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `user_employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "account" DROP COLUMN "created_by",
DROP COLUMN "description",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "classification" DROP COLUMN "created_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "department" DROP COLUMN "created_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "division" DROP COLUMN "created_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "jo_approver_setting" DROP COLUMN "created_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "meqs_approver_setting" DROP COLUMN "created_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "po_approver_setting" DROP COLUMN "created_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "rr_approver_setting" DROP COLUMN "created_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "rv_approver_setting" DROP COLUMN "created_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "spr_approver_setting" DROP COLUMN "created_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "user_employee" DROP COLUMN "updated_at",
DROP COLUMN "updated_by";
