/*
  Warnings:

  - You are about to drop the `vehicle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "spare_parts_request" DROP CONSTRAINT "spare_parts_request_vehicle_id_fkey";

-- DropTable
DROP TABLE "vehicle";
