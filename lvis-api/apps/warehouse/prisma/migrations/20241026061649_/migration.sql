/*
  Warnings:

  - You are about to drop the column `tt_number` on the `trip_ticket` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[trip_number]` on the table `trip_ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `trip_number` to the `trip_ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "trip_ticket_tt_number_key";

-- AlterTable
ALTER TABLE "trip_ticket" DROP COLUMN "tt_number",
ADD COLUMN     "trip_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "trip_ticket_trip_number_key" ON "trip_ticket"("trip_number");
