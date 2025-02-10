/*
  Warnings:

  - A unique constraint covering the columns `[invoice_number,rr_number]` on the table `receiving_report` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "receiving_report_invoice_number_key";

-- CreateIndex
CREATE UNIQUE INDEX "receiving_report_invoice_number_rr_number_key" ON "receiving_report"("invoice_number", "rr_number");
