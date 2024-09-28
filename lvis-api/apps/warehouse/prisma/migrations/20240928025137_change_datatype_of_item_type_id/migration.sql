/*
  Warnings:

  - The primary key for the `item_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `item_type` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `item_type_id` on the `item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_item_type_id_fkey";

-- AlterTable
ALTER TABLE "item" DROP COLUMN "item_type_id",
ADD COLUMN     "item_type_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "item_type" DROP CONSTRAINT "item_type_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "item_type_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "item_item_type_id_unit_id_created_by_idx" ON "item"("item_type_id", "unit_id", "created_by");

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_item_type_id_fkey" FOREIGN KEY ("item_type_id") REFERENCES "item_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
