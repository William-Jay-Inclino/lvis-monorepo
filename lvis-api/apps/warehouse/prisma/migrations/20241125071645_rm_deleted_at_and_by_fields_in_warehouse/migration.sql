/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `canvass` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `canvass` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `station` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `station` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `supplier` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `supplier` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `unit` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `unit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "canvass" DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by";

-- AlterTable
ALTER TABLE "item" DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by";

-- AlterTable
ALTER TABLE "project" DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by";

-- AlterTable
ALTER TABLE "station" DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by";

-- AlterTable
ALTER TABLE "supplier" DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by";

-- AlterTable
ALTER TABLE "unit" DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by";
