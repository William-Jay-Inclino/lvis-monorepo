/*
  Warnings:

  - A unique constraint covering the columns `[item_code,year]` on the table `item_code_tracker` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "item_code_tracker_item_code_year_key" ON "item_code_tracker"("item_code", "year");
