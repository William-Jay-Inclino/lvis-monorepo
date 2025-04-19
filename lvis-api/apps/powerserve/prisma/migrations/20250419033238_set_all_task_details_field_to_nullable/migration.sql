-- AlterTable
ALTER TABLE "task_detail_dles" ALTER COLUMN "cause_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "task_detail_kwh_meter" ALTER COLUMN "meter_number" DROP NOT NULL,
ALTER COLUMN "meter_brand_id" DROP NOT NULL,
ALTER COLUMN "cause_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "task_detail_line_services" ALTER COLUMN "cause_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "task_detail_lmdga" ALTER COLUMN "substation_id" DROP NOT NULL,
ALTER COLUMN "feeder_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "task_detail_power_interruption" ALTER COLUMN "feeder_id" DROP NOT NULL,
ALTER COLUMN "weather_condition_id" DROP NOT NULL,
ALTER COLUMN "device_id" DROP NOT NULL,
ALTER COLUMN "affected_area" DROP NOT NULL,
ALTER COLUMN "cause_id" DROP NOT NULL,
ALTER COLUMN "equipment_failed_id" DROP NOT NULL;
