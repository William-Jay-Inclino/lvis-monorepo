/*
  Warnings:

  - You are about to drop the column `metadata` on the `canvass` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `canvass_item` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `gas_slip_approver` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `gas_slip_approver` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `gas_slip_approver` table. All the data in the column will be lost.
  - You are about to drop the column `contact_number` on the `gas_station` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `gas_station` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `item` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `item_location` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `item_location` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `item_movement` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `item_movement` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `item_transaction` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `jo_approver` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `job_order` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `material_equipment_quotation_summary` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `mcrt` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `mcrt_approver` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `mcrt_approver` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `mcrt_approver` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `mcrt_item` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `mcrt_item` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `mcrt_item` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `mct` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `mct_approver` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `mct_approver` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `mct_approver` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `meqs_approver` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `meqs_supplier` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `meqs_supplier_attachment` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `meqs_supplier_item` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `mrv` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `mrv_approver` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `mrv_approver` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `mrv_approver` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `mrv_item` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `mrv_item` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `mrv_item` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `mst` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `mst_approver` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `mst_approver` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `mst_approver` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `mst_item` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `mst_item` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `mst_item` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `osriv` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `osriv_approver` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `osriv_approver` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `osriv_approver` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `osriv_item` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `osriv_item` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `osriv_item` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `po_approver` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `purchase_order` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `receiving_report` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `request_voucher` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `rr_approver` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `rr_item` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `rv_approver` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `seriv` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `seriv_approver` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `seriv_approver` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `seriv_approver` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `seriv_item` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `seriv_item` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `seriv_item` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `spare_parts_request` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `spr_approver` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `station` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `station` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `station` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `station` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `station` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `supplier` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `trip_ticket_approver` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `trip_ticket_approver` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `trip_ticket_approver` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `unit` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `unit` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `unit` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `unit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "canvass" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "canvass_item" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "gas_slip_approver" DROP COLUMN "metadata",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "gas_station" DROP COLUMN "contact_number",
DROP COLUMN "location";

-- AlterTable
ALTER TABLE "item" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "item_location" DROP COLUMN "created_by",
DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "item_movement" DROP COLUMN "created_by",
DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "item_transaction" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "item_type" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "jo_approver" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "job_order" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "material_equipment_quotation_summary" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "mcrt" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "mcrt_approver" DROP COLUMN "metadata",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "mcrt_item" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "mct" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "mct_approver" DROP COLUMN "metadata",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "meqs_approver" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "meqs_supplier" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "meqs_supplier_attachment" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "meqs_supplier_item" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "mrv" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "mrv_approver" DROP COLUMN "metadata",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "mrv_item" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "mst" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "mst_approver" DROP COLUMN "metadata",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "mst_item" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "osriv" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "osriv_approver" DROP COLUMN "metadata",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "osriv_item" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "po_approver" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "project" DROP COLUMN "created_by",
DROP COLUMN "metadata",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "purchase_order" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "receiving_report" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "request_voucher" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "rr_approver" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "rr_item" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "rv_approver" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "seriv" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "seriv_approver" DROP COLUMN "metadata",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "seriv_item" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "spare_parts_request" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "spr_approver" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "station" DROP COLUMN "created_by",
DROP COLUMN "location",
DROP COLUMN "metadata",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "supplier" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "trip_ticket_approver" DROP COLUMN "metadata",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";

-- AlterTable
ALTER TABLE "unit" DROP COLUMN "created_by",
DROP COLUMN "metadata",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";
