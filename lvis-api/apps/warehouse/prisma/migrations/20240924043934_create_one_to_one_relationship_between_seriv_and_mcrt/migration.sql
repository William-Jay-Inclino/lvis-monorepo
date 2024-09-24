/*
  Warnings:

  - A unique constraint covering the columns `[seriv_id]` on the table `mcrt` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "mcrt_mct_id_mcrt_date_idx";

-- AlterTable
ALTER TABLE "mcrt" ADD COLUMN     "seriv_id" TEXT,
ALTER COLUMN "mct_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "mcrt_seriv_id_key" ON "mcrt"("seriv_id");

-- CreateIndex
CREATE INDEX "mcrt_mcrt_date_idx" ON "mcrt"("mcrt_date");

-- AddForeignKey
ALTER TABLE "mcrt" ADD CONSTRAINT "mcrt_seriv_id_fkey" FOREIGN KEY ("seriv_id") REFERENCES "seriv"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
