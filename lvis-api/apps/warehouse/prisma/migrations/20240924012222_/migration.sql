/*
  Warnings:

  - A unique constraint covering the columns `[mct_id]` on the table `mcrt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "mcrt_mct_id_key" ON "mcrt"("mct_id");
