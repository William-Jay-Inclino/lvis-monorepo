-- AlterTable
ALTER TABLE "gas_slip" ADD COLUMN     "approval_status" INTEGER;

-- AlterTable
ALTER TABLE "job_order" ADD COLUMN     "approval_status" INTEGER;

-- AlterTable
ALTER TABLE "material_equipment_quotation_summary" ADD COLUMN     "approval_status" INTEGER;

-- AlterTable
ALTER TABLE "mcrt" ADD COLUMN     "approval_status" INTEGER;

-- AlterTable
ALTER TABLE "mct" ADD COLUMN     "approval_status" INTEGER;

-- AlterTable
ALTER TABLE "mrv" ADD COLUMN     "approval_status" INTEGER;

-- AlterTable
ALTER TABLE "mst" ADD COLUMN     "approval_status" INTEGER;

-- AlterTable
ALTER TABLE "osriv" ADD COLUMN     "approval_status" INTEGER;

-- AlterTable
ALTER TABLE "purchase_order" ADD COLUMN     "approval_status" INTEGER;

-- AlterTable
ALTER TABLE "receiving_report" ADD COLUMN     "approval_status" INTEGER;

-- AlterTable
ALTER TABLE "seriv" ADD COLUMN     "approval_status" INTEGER;

-- AlterTable
ALTER TABLE "spare_parts_request" ADD COLUMN     "approval_status" INTEGER;

-- AlterTable
ALTER TABLE "trip_ticket" ADD COLUMN     "approval_status" INTEGER;
