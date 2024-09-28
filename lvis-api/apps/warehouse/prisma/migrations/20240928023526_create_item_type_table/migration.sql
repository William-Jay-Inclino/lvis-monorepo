/*
  Warnings:

  - You are about to drop the column `item_type` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `item` table. All the data in the column will be lost.
  - Added the required column `item_type_id` to the `item` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "item_item_type_unit_id_name_created_by_idx";

-- AlterTable
ALTER TABLE "item" DROP COLUMN "item_type",
DROP COLUMN "name",
ADD COLUMN     "item_type_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "item_type" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "deleted_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "item_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "item_item_type_id_unit_id_created_by_idx" ON "item"("item_type_id", "unit_id", "created_by");

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_item_type_id_fkey" FOREIGN KEY ("item_type_id") REFERENCES "item_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
