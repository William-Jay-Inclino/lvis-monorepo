/*
  Warnings:

  - A unique constraint covering the columns `[seriv_id,label_id]` on the table `seriv_approver` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `label_id` to the `seriv_approver` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "seriv_approver_seriv_id_label_key";

-- AlterTable
ALTER TABLE "seriv" ADD COLUMN     "withdrawn_by_id" TEXT;

-- AlterTable
ALTER TABLE "seriv_approver" ADD COLUMN     "label_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "seriv_approver_seriv_id_label_id_key" ON "seriv_approver"("seriv_id", "label_id");
