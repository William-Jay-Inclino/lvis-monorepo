/*
  Warnings:

  - A unique constraint covering the columns `[municipality_id,name]` on the table `barangay` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[area_id,name]` on the table `municipality` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barangay_id,name]` on the table `sitio` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "barangay_name_key";

-- DropIndex
DROP INDEX "municipality_name_key";

-- DropIndex
DROP INDEX "sitio_name_barangay_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "barangay_municipality_id_name_key" ON "barangay"("municipality_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "municipality_area_id_name_key" ON "municipality"("area_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "sitio_barangay_id_name_key" ON "sitio"("barangay_id", "name");
