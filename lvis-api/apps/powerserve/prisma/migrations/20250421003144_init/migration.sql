-- CreateEnum
CREATE TYPE "LinemanStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "powerserve_audit" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "table" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "reference_id" TEXT,
    "metadata" JSONB,
    "ip_address" TEXT,
    "device_info" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "powerserve_audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lineman" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "area_id" TEXT NOT NULL,
    "supervisor_id" TEXT NOT NULL,
    "status" "LinemanStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "lineman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lineman_schedule" (
    "id" TEXT NOT NULL,
    "lineman_id" TEXT NOT NULL,
    "mon_shift_id" INTEGER NOT NULL,
    "tue_shift_id" INTEGER NOT NULL,
    "wed_shift_id" INTEGER NOT NULL,
    "thu_shift_id" INTEGER NOT NULL,
    "fri_shift_id" INTEGER NOT NULL,
    "sat_shift_id" INTEGER NOT NULL,
    "sun_shift_id" INTEGER NOT NULL,

    CONSTRAINT "lineman_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shift" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "start_time" TIMESTAMPTZ NOT NULL,
    "end_time" TIMESTAMPTZ NOT NULL,
    "is_day_off" BOOLEAN NOT NULL DEFAULT false,
    "color_class" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "shift_pkey" PRIMARY KEY ("id")
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
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "weather_condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
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
CREATE TABLE "unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_category_cause" (
    "id" TEXT NOT NULL,
    "category_id" INTEGER,
    "code" TEXT,
    "name" TEXT NOT NULL,

    CONSTRAINT "activity_category_cause_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "remarks" (
    "id" SERIAL NOT NULL,
    "min" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "color_class" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "remarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity" (
    "id" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "unit_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "num_of_personnel" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_category" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "activity_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaint" (
    "id" SERIAL NOT NULL,
    "report_type_id" INTEGER NOT NULL,
    "complaint_status_id" INTEGER NOT NULL,
    "assigned_group_id" TEXT NOT NULL,
    "assigned_group_type" INTEGER NOT NULL,
    "ref_number" TEXT NOT NULL,
    "complainant_name" TEXT NOT NULL,
    "complainant_contact_no" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "remarks" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaint_detail" (
    "id" SERIAL NOT NULL,
    "complaint_id" INTEGER NOT NULL,
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
    "color_class" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "complaint_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaint_report_type" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "complaint_report_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaint_log" (
    "id" SERIAL NOT NULL,
    "complaint_id" INTEGER NOT NULL,
    "complaint_status_id" INTEGER NOT NULL,
    "remarks" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "complaint_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task" (
    "id" SERIAL NOT NULL,
    "ref_number" TEXT NOT NULL,
    "complaint_id" INTEGER,
    "assignee_id" TEXT,
    "task_status_id" INTEGER NOT NULL,
    "activity_id" TEXT,
    "description" TEXT NOT NULL,
    "remarks" TEXT,
    "accomplishment_qty" DOUBLE PRECISION,
    "action_taken" TEXT NOT NULL,
    "acted_at" TIMESTAMPTZ,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_assignment" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "area_id" TEXT,
    "department_id" TEXT,
    "division_id" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_log" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "task_status_id" INTEGER NOT NULL,
    "remarks" TEXT,
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
    "color_class" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "task_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_detail_power_interruption" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "feeder_id" TEXT,
    "weather_condition_id" TEXT,
    "device_id" TEXT,
    "cause_id" TEXT,
    "barangay_id" TEXT NOT NULL,
    "distance_travel_in_km" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "affected_area" TEXT,
    "equipment_failed_id" TEXT,
    "fuse_rating" TEXT,

    CONSTRAINT "task_detail_power_interruption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "power_interruption_lineman" (
    "id" SERIAL NOT NULL,
    "task_detail_id" INTEGER NOT NULL,
    "lineman_id" TEXT NOT NULL,

    CONSTRAINT "power_interruption_lineman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_detail_kwh_meter" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "barangay_id" TEXT NOT NULL,
    "cause_id" TEXT,
    "distance_travel_in_km" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "meter_number" TEXT,
    "meter_brand_id" TEXT,
    "last_reading" TEXT,
    "initial_reading" TEXT,
    "meter_class" TEXT,

    CONSTRAINT "task_detail_kwh_meter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kwh_meter_lineman" (
    "id" SERIAL NOT NULL,
    "task_detail_id" INTEGER NOT NULL,
    "lineman_id" TEXT NOT NULL,

    CONSTRAINT "kwh_meter_lineman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_detail_line_services" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "barangay_id" TEXT NOT NULL,
    "cause_id" TEXT,
    "distance_travel_in_km" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "order_number" TEXT,
    "mrv_number" TEXT,
    "seriv_number" TEXT,
    "mst_number" TEXT,
    "mcrt_number" TEXT,

    CONSTRAINT "task_detail_line_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "line_services_lineman" (
    "id" SERIAL NOT NULL,
    "task_detail_id" INTEGER NOT NULL,
    "lineman_id" TEXT NOT NULL,

    CONSTRAINT "line_services_lineman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_detail_dles" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "barangay_id" TEXT NOT NULL,
    "cause_id" TEXT,
    "distance_travel_in_km" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sco_number" TEXT,
    "old_serial_number" TEXT,
    "new_serial_number" TEXT,
    "seriv_number" TEXT,
    "kva_rating" TEXT,

    CONSTRAINT "task_detail_dles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dles_lineman" (
    "id" SERIAL NOT NULL,
    "task_detail_id" INTEGER NOT NULL,
    "lineman_id" TEXT NOT NULL,

    CONSTRAINT "dles_lineman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_detail_lmdga" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "barangay_id" TEXT NOT NULL,
    "distance_travel_in_km" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "kva_rating" TEXT,
    "substation_id" TEXT,
    "dt_location" TEXT,
    "feeder_id" TEXT,
    "phase_number" TEXT,
    "number_of_hc" TEXT,
    "number_of_spans" TEXT,
    "copper_aluminum_primary" TEXT,
    "copper_aluminum_secondary" TEXT,
    "copper_aluminum_ground" TEXT,
    "size_primary" TEXT,
    "size_secondary" TEXT,
    "size_ground" TEXT,
    "terminal_connector_primary" TEXT,
    "terminal_connector_secondary" TEXT,
    "terminal_connector_ground" TEXT,
    "tap_position" TEXT,
    "brand" TEXT,
    "number_of_bushing_primary" TEXT,
    "number_of_bushing_secondary" TEXT,
    "protective_device" TEXT,
    "load_current_sec_bushing" TEXT,
    "load_current_neutral" TEXT,
    "load_current_one" TEXT,
    "load_current_two" TEXT,
    "voltage_level_one" TEXT,
    "voltage_level_two" TEXT,
    "sec_line_conductor_size_one" TEXT,
    "sec_line_conductor_size_two" TEXT,

    CONSTRAINT "task_detail_lmdga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lmdga_lineman" (
    "id" SERIAL NOT NULL,
    "task_detail_id" INTEGER NOT NULL,
    "lineman_id" TEXT NOT NULL,

    CONSTRAINT "lmdga_lineman_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "powerserve_audit_username_idx" ON "powerserve_audit"("username");

-- CreateIndex
CREATE INDEX "powerserve_audit_table_idx" ON "powerserve_audit"("table");

-- CreateIndex
CREATE UNIQUE INDEX "lineman_employee_id_key" ON "lineman"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "lineman_schedule_lineman_id_key" ON "lineman_schedule"("lineman_id");

-- CreateIndex
CREATE UNIQUE INDEX "shift_name_key" ON "shift"("name");

-- CreateIndex
CREATE UNIQUE INDEX "area_oic_id_key" ON "area"("oic_id");

-- CreateIndex
CREATE UNIQUE INDEX "area_name_key" ON "area"("name");

-- CreateIndex
CREATE UNIQUE INDEX "municipality_name_key" ON "municipality"("name");

-- CreateIndex
CREATE UNIQUE INDEX "barangay_name_key" ON "barangay"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sitio_name_barangay_id_key" ON "sitio"("name", "barangay_id");

-- CreateIndex
CREATE UNIQUE INDEX "feeder_name_key" ON "feeder"("name");

-- CreateIndex
CREATE UNIQUE INDEX "weather_condition_code_key" ON "weather_condition"("code");

-- CreateIndex
CREATE UNIQUE INDEX "device_code_key" ON "device"("code");

-- CreateIndex
CREATE UNIQUE INDEX "meter_brand_name_key" ON "meter_brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "unit_name_key" ON "unit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "activity_category_cause_code_key" ON "activity_category_cause"("code");

-- CreateIndex
CREATE UNIQUE INDEX "equipment_code_key" ON "equipment"("code");

-- CreateIndex
CREATE UNIQUE INDEX "activity_code_key" ON "activity"("code");

-- CreateIndex
CREATE UNIQUE INDEX "complaint_ref_number_key" ON "complaint"("ref_number");

-- CreateIndex
CREATE UNIQUE INDEX "complaint_detail_complaint_id_key" ON "complaint_detail"("complaint_id");

-- CreateIndex
CREATE UNIQUE INDEX "complaint_status_name_key" ON "complaint_status"("name");

-- CreateIndex
CREATE UNIQUE INDEX "complaint_report_type_name_key" ON "complaint_report_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "task_ref_number_key" ON "task"("ref_number");

-- CreateIndex
CREATE UNIQUE INDEX "task_assignment_task_id_key" ON "task_assignment"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_status_name_key" ON "task_status"("name");

-- CreateIndex
CREATE UNIQUE INDEX "task_detail_power_interruption_task_id_key" ON "task_detail_power_interruption"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_detail_kwh_meter_task_id_key" ON "task_detail_kwh_meter"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_detail_line_services_task_id_key" ON "task_detail_line_services"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_detail_dles_task_id_key" ON "task_detail_dles"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_detail_lmdga_task_id_key" ON "task_detail_lmdga"("task_id");

-- AddForeignKey
ALTER TABLE "lineman" ADD CONSTRAINT "lineman_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineman_schedule" ADD CONSTRAINT "lineman_schedule_mon_shift_id_fkey" FOREIGN KEY ("mon_shift_id") REFERENCES "shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineman_schedule" ADD CONSTRAINT "lineman_schedule_tue_shift_id_fkey" FOREIGN KEY ("tue_shift_id") REFERENCES "shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineman_schedule" ADD CONSTRAINT "lineman_schedule_wed_shift_id_fkey" FOREIGN KEY ("wed_shift_id") REFERENCES "shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineman_schedule" ADD CONSTRAINT "lineman_schedule_thu_shift_id_fkey" FOREIGN KEY ("thu_shift_id") REFERENCES "shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineman_schedule" ADD CONSTRAINT "lineman_schedule_fri_shift_id_fkey" FOREIGN KEY ("fri_shift_id") REFERENCES "shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineman_schedule" ADD CONSTRAINT "lineman_schedule_sat_shift_id_fkey" FOREIGN KEY ("sat_shift_id") REFERENCES "shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineman_schedule" ADD CONSTRAINT "lineman_schedule_sun_shift_id_fkey" FOREIGN KEY ("sun_shift_id") REFERENCES "shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineman_schedule" ADD CONSTRAINT "lineman_schedule_lineman_id_fkey" FOREIGN KEY ("lineman_id") REFERENCES "lineman"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "municipality" ADD CONSTRAINT "municipality_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barangay" ADD CONSTRAINT "barangay_municipality_id_fkey" FOREIGN KEY ("municipality_id") REFERENCES "municipality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sitio" ADD CONSTRAINT "sitio_barangay_id_fkey" FOREIGN KEY ("barangay_id") REFERENCES "barangay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_category_cause" ADD CONSTRAINT "activity_category_cause_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "activity_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "activity_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaint" ADD CONSTRAINT "complaint_report_type_id_fkey" FOREIGN KEY ("report_type_id") REFERENCES "complaint_report_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "task" ADD CONSTRAINT "task_complaint_id_fkey" FOREIGN KEY ("complaint_id") REFERENCES "complaint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_task_status_id_fkey" FOREIGN KEY ("task_status_id") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignment" ADD CONSTRAINT "task_assignment_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignment" ADD CONSTRAINT "task_assignment_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_log" ADD CONSTRAINT "task_log_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_log" ADD CONSTRAINT "task_log_task_status_id_fkey" FOREIGN KEY ("task_status_id") REFERENCES "task_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_file" ADD CONSTRAINT "task_file_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_power_interruption" ADD CONSTRAINT "task_detail_power_interruption_barangay_id_fkey" FOREIGN KEY ("barangay_id") REFERENCES "barangay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_power_interruption" ADD CONSTRAINT "task_detail_power_interruption_cause_id_fkey" FOREIGN KEY ("cause_id") REFERENCES "activity_category_cause"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_power_interruption" ADD CONSTRAINT "task_detail_power_interruption_feeder_id_fkey" FOREIGN KEY ("feeder_id") REFERENCES "feeder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_power_interruption" ADD CONSTRAINT "task_detail_power_interruption_weather_condition_id_fkey" FOREIGN KEY ("weather_condition_id") REFERENCES "weather_condition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_power_interruption" ADD CONSTRAINT "task_detail_power_interruption_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_power_interruption" ADD CONSTRAINT "task_detail_power_interruption_equipment_failed_id_fkey" FOREIGN KEY ("equipment_failed_id") REFERENCES "equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_power_interruption" ADD CONSTRAINT "task_detail_power_interruption_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "power_interruption_lineman" ADD CONSTRAINT "power_interruption_lineman_task_detail_id_fkey" FOREIGN KEY ("task_detail_id") REFERENCES "task_detail_power_interruption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "power_interruption_lineman" ADD CONSTRAINT "power_interruption_lineman_lineman_id_fkey" FOREIGN KEY ("lineman_id") REFERENCES "lineman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_kwh_meter" ADD CONSTRAINT "task_detail_kwh_meter_barangay_id_fkey" FOREIGN KEY ("barangay_id") REFERENCES "barangay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_kwh_meter" ADD CONSTRAINT "task_detail_kwh_meter_cause_id_fkey" FOREIGN KEY ("cause_id") REFERENCES "activity_category_cause"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_kwh_meter" ADD CONSTRAINT "task_detail_kwh_meter_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_kwh_meter" ADD CONSTRAINT "task_detail_kwh_meter_meter_brand_id_fkey" FOREIGN KEY ("meter_brand_id") REFERENCES "meter_brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kwh_meter_lineman" ADD CONSTRAINT "kwh_meter_lineman_task_detail_id_fkey" FOREIGN KEY ("task_detail_id") REFERENCES "task_detail_kwh_meter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kwh_meter_lineman" ADD CONSTRAINT "kwh_meter_lineman_lineman_id_fkey" FOREIGN KEY ("lineman_id") REFERENCES "lineman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_line_services" ADD CONSTRAINT "task_detail_line_services_barangay_id_fkey" FOREIGN KEY ("barangay_id") REFERENCES "barangay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_line_services" ADD CONSTRAINT "task_detail_line_services_cause_id_fkey" FOREIGN KEY ("cause_id") REFERENCES "activity_category_cause"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_line_services" ADD CONSTRAINT "task_detail_line_services_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "line_services_lineman" ADD CONSTRAINT "line_services_lineman_task_detail_id_fkey" FOREIGN KEY ("task_detail_id") REFERENCES "task_detail_line_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "line_services_lineman" ADD CONSTRAINT "line_services_lineman_lineman_id_fkey" FOREIGN KEY ("lineman_id") REFERENCES "lineman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_dles" ADD CONSTRAINT "task_detail_dles_barangay_id_fkey" FOREIGN KEY ("barangay_id") REFERENCES "barangay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_dles" ADD CONSTRAINT "task_detail_dles_cause_id_fkey" FOREIGN KEY ("cause_id") REFERENCES "activity_category_cause"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_dles" ADD CONSTRAINT "task_detail_dles_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dles_lineman" ADD CONSTRAINT "dles_lineman_task_detail_id_fkey" FOREIGN KEY ("task_detail_id") REFERENCES "task_detail_dles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dles_lineman" ADD CONSTRAINT "dles_lineman_lineman_id_fkey" FOREIGN KEY ("lineman_id") REFERENCES "lineman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_lmdga" ADD CONSTRAINT "task_detail_lmdga_barangay_id_fkey" FOREIGN KEY ("barangay_id") REFERENCES "barangay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_lmdga" ADD CONSTRAINT "task_detail_lmdga_feeder_id_fkey" FOREIGN KEY ("feeder_id") REFERENCES "feeder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_detail_lmdga" ADD CONSTRAINT "task_detail_lmdga_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lmdga_lineman" ADD CONSTRAINT "lmdga_lineman_task_detail_id_fkey" FOREIGN KEY ("task_detail_id") REFERENCES "task_detail_lmdga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lmdga_lineman" ADD CONSTRAINT "lmdga_lineman_lineman_id_fkey" FOREIGN KEY ("lineman_id") REFERENCES "lineman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
