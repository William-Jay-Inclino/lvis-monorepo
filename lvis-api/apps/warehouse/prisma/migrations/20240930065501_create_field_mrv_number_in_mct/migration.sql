/*
  Warnings:

  - A unique constraint covering the columns `[mrv_number]` on the table `mct` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mrv_number` to the `mct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mct" ADD COLUMN     "mrv_number" TEXT NOT NULL,
ALTER COLUMN "mrv_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "mct_mrv_number_key" ON "mct"("mrv_number");
