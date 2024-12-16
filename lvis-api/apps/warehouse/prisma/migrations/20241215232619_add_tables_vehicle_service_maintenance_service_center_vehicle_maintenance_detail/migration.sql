-- CreateTable
CREATE TABLE "vehicle_service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "vehicle_service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_center" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "contact_person" TEXT NOT NULL DEFAULT 'N/A',
    "contact_number" TEXT NOT NULL DEFAULT 'N/A',
    "remarks" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "service_center_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_maintenance" (
    "id" TEXT NOT NULL,
    "ref_number" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "service_center_id" TEXT NOT NULL,
    "service_date" TIMESTAMP(3) NOT NULL,
    "service_mileage" INTEGER NOT NULL,
    "next_service_date" TIMESTAMP(3) NOT NULL,
    "next_service_mileage" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "remarks" TEXT NOT NULL,
    "performed_by" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicle_maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_maintenance_detail" (
    "id" TEXT NOT NULL,
    "maintenance_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "vehicle_maintenance_detail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_center_name_key" ON "service_center"("name");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_maintenance_ref_number_key" ON "vehicle_maintenance"("ref_number");

-- CreateIndex
CREATE INDEX "vehicle_maintenance_vehicle_id_idx" ON "vehicle_maintenance"("vehicle_id");

-- AddForeignKey
ALTER TABLE "vehicle_maintenance" ADD CONSTRAINT "vehicle_maintenance_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_maintenance" ADD CONSTRAINT "vehicle_maintenance_service_center_id_fkey" FOREIGN KEY ("service_center_id") REFERENCES "service_center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_maintenance_detail" ADD CONSTRAINT "vehicle_maintenance_detail_maintenance_id_fkey" FOREIGN KEY ("maintenance_id") REFERENCES "vehicle_maintenance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_maintenance_detail" ADD CONSTRAINT "vehicle_maintenance_detail_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "vehicle_service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
