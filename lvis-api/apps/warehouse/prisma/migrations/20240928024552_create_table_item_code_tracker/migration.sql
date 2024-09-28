/*
  Warnings:

  - You are about to drop the column `created_at` on the `item_type` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `item_type` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `item_type` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `item_type` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `item_type` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `item_type` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `item_type` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `item_type` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `item_type` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "item_type" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "metadata",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
ADD COLUMN     "code" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "item_code_tracker" (
    "id" SERIAL NOT NULL,
    "item_code" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "last_incremental" INTEGER NOT NULL,

    CONSTRAINT "item_code_tracker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "item_code_tracker_item_code_key" ON "item_code_tracker"("item_code");

-- CreateIndex
CREATE UNIQUE INDEX "item_type_code_key" ON "item_type"("code");
