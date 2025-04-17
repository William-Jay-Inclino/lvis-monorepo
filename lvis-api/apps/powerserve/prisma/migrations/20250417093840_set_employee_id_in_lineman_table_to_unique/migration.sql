/*
  Warnings:

  - A unique constraint covering the columns `[employee_id]` on the table `lineman` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "lineman_employee_id_key" ON "lineman"("employee_id");
