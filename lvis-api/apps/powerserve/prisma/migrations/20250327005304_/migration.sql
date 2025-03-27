/*
  Warnings:

  - A unique constraint covering the columns `[name,barangay_id]` on the table `sitio` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "sitio_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "sitio_name_barangay_id_key" ON "sitio"("name", "barangay_id");
