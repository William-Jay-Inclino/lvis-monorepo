/*
  Warnings:

  - The `project_id` column on the `mrv` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `project_id` on the `project_item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "mrv" DROP CONSTRAINT "mrv_project_id_fkey";

-- DropForeignKey
ALTER TABLE "project_item" DROP CONSTRAINT "project_item_project_id_fkey";

-- AlterTable
ALTER TABLE "mrv" DROP COLUMN "project_id",
ADD COLUMN     "project_id" UUID;

-- AlterTable
ALTER TABLE "project" DROP CONSTRAINT "project_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "project_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "project_item" DROP COLUMN "project_id",
ADD COLUMN     "project_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "project_item_project_id_idx" ON "project_item"("project_id");

-- AddForeignKey
ALTER TABLE "project_item" ADD CONSTRAINT "project_item_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mrv" ADD CONSTRAINT "mrv_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
