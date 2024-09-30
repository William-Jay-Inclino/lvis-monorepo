/*
  Warnings:

  - A unique constraint covering the columns `[jo_number]` on the table `material_equipment_quotation_summary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rv_number]` on the table `material_equipment_quotation_summary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spr_number]` on the table `material_equipment_quotation_summary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[meqs_number]` on the table `purchase_order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[po_number]` on the table `receiving_report` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `meqs_number` to the `purchase_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `po_number` to the `receiving_report` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "material_equipment_quotation_summary" ADD COLUMN     "jo_number" TEXT,
ADD COLUMN     "rv_number" TEXT,
ADD COLUMN     "spr_number" TEXT;

-- AlterTable
ALTER TABLE "purchase_order" ADD COLUMN     "meqs_number" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "receiving_report" ADD COLUMN     "po_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "material_equipment_quotation_summary_jo_number_key" ON "material_equipment_quotation_summary"("jo_number");

-- CreateIndex
CREATE UNIQUE INDEX "material_equipment_quotation_summary_rv_number_key" ON "material_equipment_quotation_summary"("rv_number");

-- CreateIndex
CREATE UNIQUE INDEX "material_equipment_quotation_summary_spr_number_key" ON "material_equipment_quotation_summary"("spr_number");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_order_meqs_number_key" ON "purchase_order"("meqs_number");

-- CreateIndex
CREATE UNIQUE INDEX "receiving_report_po_number_key" ON "receiving_report"("po_number");
