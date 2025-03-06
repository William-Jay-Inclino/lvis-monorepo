-- CreateEnum
CREATE TYPE "LinemanStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "lineman" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "area_id" TEXT NOT NULL,
    "supervisor_id" TEXT NOT NULL,
    "status" "LinemanStatus" NOT NULL,

    CONSTRAINT "lineman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "area" (
    "id" TEXT NOT NULL,
    "oic_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "municipality" (
    "id" TEXT NOT NULL,
    "area_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "municipality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barangay" (
    "id" TEXT NOT NULL,
    "municipality_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "barangay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sitio" (
    "id" TEXT NOT NULL,
    "barangay_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "sitio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feeder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "feeder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weather_condition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "weather_condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meter_brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "meter_brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaint" (
    "id" SERIAL NOT NULL,
    "report_type_id" INTEGER NOT NULL,
    "nature_of_complaint_id" TEXT NOT NULL,
    "complaint_status_id" INTEGER NOT NULL,
    "ref_number" TEXT NOT NULL,
    "complainant_name" TEXT NOT NULL,
    "complainant_contact_no" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaint_detail" (
    "id" SERIAL NOT NULL,
    "complaint_id" INTEGER,
    "account_number" TEXT,
    "meter_number" TEXT,
    "consumer_id" TEXT,
    "barangay_id" TEXT NOT NULL,
    "sitio_id" TEXT,
    "landmark" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "complaint_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaint_status" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "complaint_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaint_report_type" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "complaint_report_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaint_category" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "complaint_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaint_log" (
    "id" SERIAL NOT NULL,
    "complaint_id" INTEGER NOT NULL,
    "complaint_status_id" INTEGER NOT NULL,
    "remarks" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "complaint_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nature_of_complaint" (
    "id" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "number_of_personnel_required" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "nature_of_complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" SERIAL NOT NULL,
    "ref_number" TEXT NOT NULL,
    "complaint_id" INTEGER NOT NULL,
    "assigned_to_id" TEXT,
    "task_status_id" INTEGER NOT NULL,
    "remarks" TEXT NOT NULL,
    "accomplishment" TEXT NOT NULL,
    "action_taken" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_log" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "task_status_id" INTEGER NOT NULL,
    "remarks" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_file" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "source_path" TEXT NOT NULL,

    CONSTRAINT "task_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_status" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "task_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_detail_power_interruption" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "feeder_id" TEXT NOT NULL,
    "weather_condition_id" TEXT NOT NULL,
    "lineman_incharge_id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "distance_travel_in_km" INTEGER NOT NULL,
    "affected_area" TEXT NOT NULL,
    "cause" TEXT NOT NULL,
    "equipment_failed" TEXT NOT NULL,
    "fuse_rating" TEXT NOT NULL,

    CONSTRAINT "task_detail_power_interruption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_detail_kwh_meter" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "lineman_incharge_id" TEXT NOT NULL,
    "distance_travel_in_km" INTEGER NOT NULL,
    "meter_number" TEXT NOT NULL,
    "meter_brand_id" TEXT NOT NULL,
    "last_reading" TEXT NOT NULL,
    "initial_reading" TEXT NOT NULL,
    "meter_class" TEXT NOT NULL,

    CONSTRAINT "task_detail_kwh_meter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_detail_line_services" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "lineman_incharge_id" TEXT NOT NULL,
    "distance_travel_in_km" INTEGER NOT NULL,
    "order_number" TEXT NOT NULL,
    "cause" TEXT NOT NULL,
    "mrv_number" TEXT NOT NULL,
    "seriv_number" TEXT NOT NULL,
    "mst_number" TEXT NOT NULL,
    "mcrt_number" TEXT NOT NULL,

    CONSTRAINT "task_detail_line_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_detail_distribution_line_equipment_services" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "lineman_incharge_id" TEXT NOT NULL,
    "distance_travel_in_km" INTEGER NOT NULL,
    "sco_number" TEXT NOT NULL,
    "old_serial_number" TEXT NOT NULL,
    "new_serial_number" TEXT NOT NULL,
    "seriv_number" TEXT NOT NULL,
    "kva_rating" TEXT NOT NULL,
    "cause" TEXT NOT NULL,

    CONSTRAINT "task_detail_distribution_line_equipment_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_detail_lmdga" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "lineman_incharge_id" TEXT NOT NULL,
    "distance_travel_in_km" INTEGER NOT NULL,
    "kva_rating" TEXT NOT NULL,
    "substation_id" TEXT NOT NULL,
    "dt_location" TEXT NOT NULL,
    "feeder_id" TEXT NOT NULL,
    "phase_number" TEXT NOT NULL,
    "number_of_hc" TEXT NOT NULL,
    "number_of_spans" TEXT NOT NULL,
    "copper_aluminum_primary" TEXT NOT NULL,
    "copper_aluminum_secondary" TEXT NOT NULL,
    "copper_aluminum_ground" TEXT NOT NULL,
    "size_primary" TEXT NOT NULL,
    "size_secondary" TEXT NOT NULL,
    "size_ground" TEXT NOT NULL,
    "terminal_connector_primary" TEXT NOT NULL,
    "terminal_connector_secondary" TEXT NOT NULL,
    "terminal_connector_ground" TEXT NOT NULL,
    "tap_position" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "number_of_bushing_primary" TEXT NOT NULL,
    "number_of_bushing_secondary" TEXT NOT NULL,
    "protective_device" TEXT NOT NULL,
    "load_current_sec_bushing" TEXT NOT NULL,
    "load_current_neutral" TEXT NOT NULL,
    "load_current_one" TEXT NOT NULL,
    "load_current_two" TEXT NOT NULL,
    "voltage_level_one" TEXT NOT NULL,
    "voltage_level_two" TEXT NOT NULL,
    "sec_line_conductor_size_one" TEXT NOT NULL,
    "sec_line_conductor_size_two" TEXT NOT NULL,

    CONSTRAINT "task_detail_lmdga_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "area_name_key" ON "area"("name");

-- CreateIndex
CREATE UNIQUE INDEX "municipality_name_key" ON "municipality"("name");

-- CreateIndex
CREATE UNIQUE INDEX "barangay_name_key" ON "barangay"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sitio_name_key" ON "sitio"("name");

-- CreateIndex
CREATE UNIQUE INDEX "feeder_name_key" ON "feeder"("name");

-- CreateIndex
CREATE UNIQUE INDEX "weather_condition_name_key" ON "weather_condition"("name");

-- CreateIndex
CREATE UNIQUE INDEX "device_name_key" ON "device"("name");

-- CreateIndex
CREATE UNIQUE INDEX "meter_brand_name_key" ON "meter_brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "complaint_ref_number_key" ON "complaint"("ref_number");

-- CreateIndex
CREATE UNIQUE INDEX "complaint_detail_complaint_id_key" ON "complaint_detail"("complaint_id");

-- CreateIndex
CREATE UNIQUE INDEX "complaint_status_name_key" ON "complaint_status"("name");

-- CreateIndex
CREATE UNIQUE INDEX "complaint_report_type_name_key" ON "complaint_report_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "complaint_category_name_key" ON "complaint_category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "task_ref_number_key" ON "task"("ref_number");

-- CreateIndex
CREATE UNIQUE INDEX "task_status_name_key" ON "task_status"("name");

-- CreateIndex
CREATE UNIQUE INDEX "task_detail_power_interruption_task_id_key" ON "task_detail_power_interruption"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_detail_kwh_meter_task_id_key" ON "task_detail_kwh_meter"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_detail_line_services_task_id_key" ON "task_detail_line_services"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_detail_distribution_line_equipment_services_task_id_key" ON "task_detail_distribution_line_equipment_services"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_detail_lmdga_task_id_key" ON "task_detail_lmdga"("task_id");

-- AddForeignKey
ALTER TABLE "lineman" ADD CONSTRAINT "lineman_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "municipality" ADD CONSTRAINT "municipality_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barangay" ADD CONSTRAINT "barangay_municipality_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "municipality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sitio" ADD CONSTRAINT "sitio_barangay_id_fkey" FOREIGN KEY ("barangay_id") REFERENCES "barangay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaint" ADD CONSTRAINT "complaint_report_type_id_fkey" FOREIGN KEY ("report_type_id") REFERENCES "complaint_report_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaint" ADD CONSTRAINT "complaint_nature_of_complaint_id_fkey" FOREIGN KEY ("nature_of_complaint_id") REFERENCES "nature_of_complaint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaint" ADD CONSTRAINT "complaint_complaint_status_id_fkey" FOREIGN KEY ("complaint_status_id") REFERENCES "complaint_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaint_detail" ADD CONSTRAINT "complaint_detail_complaint_id_fkey" FOREIGN KEY ("complaint_id") REFERENCES "complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaint_detail" ADD CONSTRAINT "complaint_detail_barangay_id_fkey" FOREIGN KEY ("barangay_id") REFERENCES "barangay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaint_detail" ADD CONSTRAINT "complaint_detail_sitio_id_fkey" FOREIGN KEY ("sitio_id") REFERENCES "sitio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaint_log" ADD CONSTRAINT "complaint_log_complaint_id_fkey" FOREIGN KEY ("complaint_id") REFERENCES "complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaint_log" ADD CONSTRAINT "complaint_log_complaint_status_id_fkey" FOREIGN KEY ("complaint_status_id") REFERENCES "complaint_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nature_of_complaint" ADD CONSTRAINT "nature_of_complaint_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "complaint_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_complaint_id_fkey" FOREIGN KEY ("complaint_id") REFERENCES "complaint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_task_status_id_fkey" FOREIGN KEY ("task_status_id") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_log" ADD CONSTRAINT "task_log_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_log" ADD CONSTRAINT "task_log_task_status_id_fkey" FOREIGN KEY ("task_status_id") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_file" ADD CONSTRAINT "task_file_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_power_interruption" ADD CONSTRAINT "task_detail_power_interruption_lineman_incharge_id_fkey" FOREIGN KEY ("lineman_incharge_id") REFERENCES "lineman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_power_interruption" ADD CONSTRAINT "task_detail_power_interruption_feeder_id_fkey" FOREIGN KEY ("feeder_id") REFERENCES "feeder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_power_interruption" ADD CONSTRAINT "task_detail_power_interruption_weather_condition_id_fkey" FOREIGN KEY ("weather_condition_id") REFERENCES "weather_condition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_power_interruption" ADD CONSTRAINT "task_detail_power_interruption_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_power_interruption" ADD CONSTRAINT "task_detail_power_interruption_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_kwh_meter" ADD CONSTRAINT "task_detail_kwh_meter_lineman_incharge_id_fkey" FOREIGN KEY ("lineman_incharge_id") REFERENCES "lineman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_kwh_meter" ADD CONSTRAINT "task_detail_kwh_meter_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_kwh_meter" ADD CONSTRAINT "task_detail_kwh_meter_meter_brand_id_fkey" FOREIGN KEY ("meter_brand_id") REFERENCES "meter_brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_line_services" ADD CONSTRAINT "task_detail_line_services_lineman_incharge_id_fkey" FOREIGN KEY ("lineman_incharge_id") REFERENCES "lineman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_line_services" ADD CONSTRAINT "task_detail_line_services_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_distribution_line_equipment_services" ADD CONSTRAINT "task_detail_distribution_line_equipment_services_lineman_i_fkey" FOREIGN KEY ("lineman_incharge_id") REFERENCES "lineman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_distribution_line_equipment_services" ADD CONSTRAINT "task_detail_distribution_line_equipment_services_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_lmdga" ADD CONSTRAINT "task_detail_lmdga_lineman_incharge_id_fkey" FOREIGN KEY ("lineman_incharge_id") REFERENCES "lineman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_lmdga" ADD CONSTRAINT "task_detail_lmdga_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
