/*
  Warnings:

  - Changed the type of `action` on the `warehouse_audit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "warehouse_audit" DROP COLUMN "action",
ADD COLUMN     "action" TEXT NOT NULL;

-- DropEnum
DROP TYPE "AuditAction";
