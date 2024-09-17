/*
  Warnings:

  - A unique constraint covering the columns `[mrv_id,label_id]` on the table `mrv_approver` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `request_type` on the `mrv` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `jo_number` on table `mrv` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `label_id` to the `mrv_approver` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mrv" ADD COLUMN     "mwo_number" TEXT,
ADD COLUMN     "withdrawn_by_id" TEXT,
DROP COLUMN "request_type",
ADD COLUMN     "request_type" INTEGER NOT NULL,
ALTER COLUMN "jo_number" SET NOT NULL;

-- AlterTable
ALTER TABLE "mrv_approver" ADD COLUMN     "label_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "mrv_item" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "mrv_approver_mrv_id_label_id_key" ON "mrv_approver"("mrv_id", "label_id");
