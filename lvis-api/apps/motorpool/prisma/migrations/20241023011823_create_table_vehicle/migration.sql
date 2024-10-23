-- CreateTable
CREATE TABLE "vehicle" (
    "id" TEXT NOT NULL,
    "vehicle_number" TEXT NOT NULL,
    "plate_number" TEXT NOT NULL,
    "rf_id" TEXT NOT NULL,
    "classification_id" INTEGER NOT NULL,
    "assignee_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date_acquired" TIMESTAMP(3) NOT NULL,
    "status" INTEGER NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_vehicle_number_key" ON "vehicle"("vehicle_number");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_plate_number_key" ON "vehicle"("plate_number");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_rf_id_key" ON "vehicle"("rf_id");
