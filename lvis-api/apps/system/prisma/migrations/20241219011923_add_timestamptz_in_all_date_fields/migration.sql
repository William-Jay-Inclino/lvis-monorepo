-- AlterTable
ALTER TABLE "account" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "classification" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "department" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "division" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "employee" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "jo_approver_setting" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "meqs_approver_setting" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "po_approver_setting" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "rr_approver_setting" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "rv_approver_setting" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "spr_approver_setting" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "user_audit_log" ALTER COLUMN "event_timestamp" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "user_employee" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "user_group" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "user_group_member" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ;
