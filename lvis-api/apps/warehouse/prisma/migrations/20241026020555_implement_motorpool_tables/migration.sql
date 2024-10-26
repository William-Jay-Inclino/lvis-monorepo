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

-- CreateTable
CREATE TABLE "trip_ticket" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "passengers" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "actual_start_time" TIMESTAMP(3),
    "actual_end_time" TIMESTAMP(3),
    "is_operation" BOOLEAN NOT NULL,
    "is_stay_in" BOOLEAN NOT NULL,
    "is_personal" BOOLEAN NOT NULL,
    "is_out_of_coverage" BOOLEAN NOT NULL,
    "prepared_by_id" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trip_ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_ticket_approver" (
    "id" TEXT NOT NULL,
    "trip_ticket_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMP(3),
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "trip_ticket_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gas_slip" (
    "id" TEXT NOT NULL,
    "gas_slip_number" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "gas_station_id" INTEGER NOT NULL,
    "fuel_type_id" INTEGER NOT NULL,
    "requested_by_id" TEXT NOT NULL,
    "with_container" BOOLEAN NOT NULL,
    "liter_in_text" TEXT NOT NULL,
    "actual_liter" DOUBLE PRECISION,
    "price_per_liter" DOUBLE PRECISION,
    "purpose" TEXT NOT NULL,
    "is_posted" BOOLEAN NOT NULL DEFAULT false,
    "print_count" INTEGER NOT NULL DEFAULT 0,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gas_slip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gas_slip_approver" (
    "id" TEXT NOT NULL,
    "gas_slip_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMP(3),
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "updated_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "gas_slip_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gas_station" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,

    CONSTRAINT "gas_station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fuel_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "fuel_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_vehicle_number_key" ON "vehicle"("vehicle_number");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_plate_number_key" ON "vehicle"("plate_number");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_rf_id_key" ON "vehicle"("rf_id");

-- CreateIndex
CREATE INDEX "vehicle_assignee_id_classification_id_status_idx" ON "vehicle"("assignee_id", "classification_id", "status");

-- CreateIndex
CREATE INDEX "trip_ticket_start_time_end_time_actual_start_time_actual_en_idx" ON "trip_ticket"("start_time", "end_time", "actual_start_time", "actual_end_time", "status");

-- CreateIndex
CREATE INDEX "trip_ticket_approver_trip_ticket_id_idx" ON "trip_ticket_approver"("trip_ticket_id");

-- CreateIndex
CREATE UNIQUE INDEX "trip_ticket_approver_trip_ticket_id_order_key" ON "trip_ticket_approver"("trip_ticket_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "gas_slip_gas_slip_number_key" ON "gas_slip"("gas_slip_number");

-- CreateIndex
CREATE INDEX "gas_slip_vehicle_id_driver_id_gas_station_id_requested_by_i_idx" ON "gas_slip"("vehicle_id", "driver_id", "gas_station_id", "requested_by_id");

-- CreateIndex
CREATE INDEX "gas_slip_approver_gas_slip_id_idx" ON "gas_slip_approver"("gas_slip_id");

-- CreateIndex
CREATE UNIQUE INDEX "gas_slip_approver_gas_slip_id_order_key" ON "gas_slip_approver"("gas_slip_id", "order");

-- AddForeignKey
ALTER TABLE "trip_ticket" ADD CONSTRAINT "trip_ticket_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_ticket_approver" ADD CONSTRAINT "trip_ticket_approver_trip_ticket_id_fkey" FOREIGN KEY ("trip_ticket_id") REFERENCES "trip_ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gas_slip" ADD CONSTRAINT "gas_slip_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gas_slip" ADD CONSTRAINT "gas_slip_gas_station_id_fkey" FOREIGN KEY ("gas_station_id") REFERENCES "gas_station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gas_slip" ADD CONSTRAINT "gas_slip_fuel_type_id_fkey" FOREIGN KEY ("fuel_type_id") REFERENCES "fuel_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gas_slip_approver" ADD CONSTRAINT "gas_slip_approver_gas_slip_id_fkey" FOREIGN KEY ("gas_slip_id") REFERENCES "gas_slip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
