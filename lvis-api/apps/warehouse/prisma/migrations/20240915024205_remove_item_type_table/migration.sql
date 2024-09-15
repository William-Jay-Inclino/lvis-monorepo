/*
  Warnings:

  - You are about to drop the column `item_type_id` on the `item` table. All the data in the column will be lost.
  - You are about to drop the `item_type` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `item_type` to the `item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_item_type_id_fkey";

-- DropIndex
DROP INDEX "item_item_type_id_unit_id_name_created_by_idx";

-- AlterTable
ALTER TABLE "item" DROP COLUMN "item_type_id",
ADD COLUMN     "item_type" INTEGER NOT NULL;

-- DropTable
DROP TABLE "item_type";

-- CreateIndex
CREATE INDEX "item_item_type_unit_id_name_created_by_idx" ON "item"("item_type", "unit_id", "name", "created_by");
