/*
  Warnings:

  - You are about to drop the column `received_by_id` on the `mcrt` table. All the data in the column will be lost.
  - Added the required column `label_id` to the `mcrt_approver` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mcrt" DROP COLUMN "received_by_id";

-- AlterTable
ALTER TABLE "mcrt_approver" ADD COLUMN     "label_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "mcrt_item" (
    "id" TEXT NOT NULL,
    "mcrt_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metadata" JSONB,

    CONSTRAINT "mcrt_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mcrt_item_mcrt_id_item_id_idx" ON "mcrt_item"("mcrt_id", "item_id");

-- AddForeignKey
ALTER TABLE "mcrt_item" ADD CONSTRAINT "mcrt_item_mcrt_id_fkey" FOREIGN KEY ("mcrt_id") REFERENCES "mcrt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mcrt_item" ADD CONSTRAINT "mcrt_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
