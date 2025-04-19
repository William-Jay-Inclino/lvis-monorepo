-- AlterTable
ALTER TABLE "task_detail_dles" ALTER COLUMN "sco_number" DROP NOT NULL,
ALTER COLUMN "old_serial_number" DROP NOT NULL,
ALTER COLUMN "new_serial_number" DROP NOT NULL,
ALTER COLUMN "seriv_number" DROP NOT NULL,
ALTER COLUMN "kva_rating" DROP NOT NULL;

-- AlterTable
ALTER TABLE "task_detail_kwh_meter" ALTER COLUMN "last_reading" DROP NOT NULL,
ALTER COLUMN "initial_reading" DROP NOT NULL,
ALTER COLUMN "meter_class" DROP NOT NULL;

-- AlterTable
ALTER TABLE "task_detail_line_services" ALTER COLUMN "order_number" DROP NOT NULL,
ALTER COLUMN "mrv_number" DROP NOT NULL,
ALTER COLUMN "seriv_number" DROP NOT NULL,
ALTER COLUMN "mst_number" DROP NOT NULL,
ALTER COLUMN "mcrt_number" DROP NOT NULL;

-- AlterTable
ALTER TABLE "task_detail_lmdga" ALTER COLUMN "kva_rating" DROP NOT NULL,
ALTER COLUMN "dt_location" DROP NOT NULL,
ALTER COLUMN "phase_number" DROP NOT NULL,
ALTER COLUMN "number_of_hc" DROP NOT NULL,
ALTER COLUMN "number_of_spans" DROP NOT NULL,
ALTER COLUMN "copper_aluminum_primary" DROP NOT NULL,
ALTER COLUMN "copper_aluminum_secondary" DROP NOT NULL,
ALTER COLUMN "copper_aluminum_ground" DROP NOT NULL,
ALTER COLUMN "size_primary" DROP NOT NULL,
ALTER COLUMN "size_secondary" DROP NOT NULL,
ALTER COLUMN "size_ground" DROP NOT NULL,
ALTER COLUMN "terminal_connector_primary" DROP NOT NULL,
ALTER COLUMN "terminal_connector_secondary" DROP NOT NULL,
ALTER COLUMN "terminal_connector_ground" DROP NOT NULL,
ALTER COLUMN "tap_position" DROP NOT NULL,
ALTER COLUMN "brand" DROP NOT NULL,
ALTER COLUMN "number_of_bushing_primary" DROP NOT NULL,
ALTER COLUMN "number_of_bushing_secondary" DROP NOT NULL,
ALTER COLUMN "protective_device" DROP NOT NULL,
ALTER COLUMN "load_current_sec_bushing" DROP NOT NULL,
ALTER COLUMN "load_current_neutral" DROP NOT NULL,
ALTER COLUMN "load_current_one" DROP NOT NULL,
ALTER COLUMN "load_current_two" DROP NOT NULL,
ALTER COLUMN "voltage_level_one" DROP NOT NULL,
ALTER COLUMN "voltage_level_two" DROP NOT NULL,
ALTER COLUMN "sec_line_conductor_size_one" DROP NOT NULL,
ALTER COLUMN "sec_line_conductor_size_two" DROP NOT NULL;

-- AlterTable
ALTER TABLE "task_detail_power_interruption" ALTER COLUMN "fuse_rating" DROP NOT NULL;
