/*
  Warnings:

  - You are about to drop the column `prepared_by` on the `trip_ticket` table. All the data in the column will be lost.
  - Added the required column `prepared_by_id` to the `trip_ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trip_ticket" DROP COLUMN "prepared_by",
ADD COLUMN     "prepared_by_id" TEXT NOT NULL;
