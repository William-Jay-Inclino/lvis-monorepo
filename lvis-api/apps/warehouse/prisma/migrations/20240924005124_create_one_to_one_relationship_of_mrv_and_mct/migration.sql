/*
  Warnings:

  - A unique constraint covering the columns `[mrv_id]` on the table `mct` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "mct_mrv_id_key" ON "mct"("mrv_id");
