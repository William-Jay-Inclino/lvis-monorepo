/*
  Warnings:

  - A unique constraint covering the columns `[oic_id]` on the table `area` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "area_oic_id_key" ON "area"("oic_id");
