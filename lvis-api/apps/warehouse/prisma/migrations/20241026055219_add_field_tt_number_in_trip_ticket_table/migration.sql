/*
  Warnings:

  - A unique constraint covering the columns `[tt_number]` on the table `trip_ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tt_number` to the `trip_ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trip_ticket" ADD COLUMN     "tt_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "trip_ticket_tt_number_key" ON "trip_ticket"("tt_number");
