/*
  Warnings:

  - A unique constraint covering the columns `[mwo_number]` on the table `mrv` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mwo_number]` on the table `seriv` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "mwo_sequence_tracker" (
    "id" SERIAL NOT NULL,
    "yearMonth" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mwo_sequence_tracker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mwo_sequence_tracker_yearMonth_key" ON "mwo_sequence_tracker"("yearMonth");

-- CreateIndex
CREATE UNIQUE INDEX "mrv_mwo_number_key" ON "mrv"("mwo_number");

-- CreateIndex
CREATE UNIQUE INDEX "seriv_mwo_number_key" ON "seriv"("mwo_number");
