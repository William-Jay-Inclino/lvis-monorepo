/*
  Warnings:

  - Added the required column `updated_at` to the `mcrt_approver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `mcrt_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `mct_approver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `mrv_approver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `mrv_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `mst_approver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `mst_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `osriv_approver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `osriv_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `seriv_approver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `seriv_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mcrt_approver" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "mcrt_item" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "mct_approver" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "mrv_approver" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "mrv_item" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "mst_approver" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "mst_item" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "osriv_approver" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "osriv_item" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "seriv_approver" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "seriv_item" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" TEXT NOT NULL;
