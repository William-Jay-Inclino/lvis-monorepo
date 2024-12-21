-- CreateTable
CREATE TABLE "item_type" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "tin" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "vat_type" INTEGER NOT NULL DEFAULT 1,
    "is_vat_registered" BOOLEAN NOT NULL DEFAULT false,
    "contact_person" TEXT,
    "remarks" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "station" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pending" (
    "id" SERIAL NOT NULL,
    "approver_id" TEXT NOT NULL,
    "reference_number" TEXT NOT NULL,
    "reference_table" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "transaction_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approver_notes" TEXT,

    CONSTRAINT "pending_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setting" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mwo_sequence_tracker" (
    "id" SERIAL NOT NULL,
    "yearMonth" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "mwo_sequence_tracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "item_type_id" INTEGER NOT NULL,
    "unit_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "total_quantity" INTEGER NOT NULL,
    "quantity_on_queue" INTEGER NOT NULL DEFAULT 0,
    "alert_level" INTEGER NOT NULL DEFAULT 20,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_item" (
    "id" SERIAL NOT NULL,
    "project_id" UUID NOT NULL,
    "item_id" UUID,

    CONSTRAINT "project_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_location" (
    "id" TEXT NOT NULL,
    "item_id" UUID NOT NULL,
    "station_id" TEXT NOT NULL,
    "quantity_on_hand" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_movement" (
    "id" TEXT NOT NULL,
    "origin_id" TEXT NOT NULL,
    "destination_id" TEXT NOT NULL,
    "quantity_moved" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_movement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_transaction" (
    "id" SERIAL NOT NULL,
    "item_id" UUID NOT NULL,
    "rr_item_id" TEXT,
    "osriv_item_id" TEXT,
    "seriv_item_id" TEXT,
    "mrv_item_id" TEXT,
    "mcrt_item_id" TEXT,
    "mst_item_id" TEXT,
    "type" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,
    "is_initial" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL DEFAULT 'admin',

    CONSTRAINT "item_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_code_tracker" (
    "id" SERIAL NOT NULL,
    "item_code" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "last_incremental" INTEGER NOT NULL,

    CONSTRAINT "item_code_tracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canvass" (
    "id" TEXT NOT NULL,
    "rc_number" TEXT NOT NULL,
    "date_requested" TIMESTAMPTZ NOT NULL,
    "purpose" TEXT NOT NULL,
    "notes" TEXT,
    "requested_by_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "canvass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canvass_item" (
    "id" TEXT NOT NULL,
    "canvass_id" TEXT NOT NULL,
    "unit_id" TEXT,
    "item_id" UUID,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "canvass_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_voucher" (
    "id" TEXT NOT NULL,
    "rv_number" TEXT NOT NULL,
    "canvass_number" TEXT NOT NULL,
    "canvass_id" TEXT,
    "classification_id" TEXT,
    "date_requested" TIMESTAMPTZ NOT NULL,
    "work_order_no" TEXT,
    "work_order_date" TIMESTAMPTZ,
    "notes" TEXT NOT NULL,
    "approval_status" INTEGER,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "request_voucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rv_approver" (
    "id" TEXT NOT NULL,
    "rv_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMPTZ,
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "rv_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_order" (
    "id" TEXT NOT NULL,
    "jo_number" TEXT NOT NULL,
    "canvass_number" TEXT NOT NULL,
    "date_requested" TIMESTAMPTZ NOT NULL,
    "canvass_id" TEXT,
    "equipment" TEXT NOT NULL DEFAULT '',
    "classification_id" TEXT,
    "department_id" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "approval_status" INTEGER,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "job_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jo_approver" (
    "id" TEXT NOT NULL,
    "jo_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMPTZ,
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "jo_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spare_parts_request" (
    "id" TEXT NOT NULL,
    "canvass_number" TEXT NOT NULL,
    "spr_number" TEXT NOT NULL,
    "date_requested" TIMESTAMPTZ NOT NULL,
    "canvass_id" TEXT,
    "vehicle_id" TEXT NOT NULL,
    "classification_id" TEXT,
    "notes" TEXT NOT NULL,
    "approval_status" INTEGER,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "spare_parts_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spr_approver" (
    "id" TEXT NOT NULL,
    "spr_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMPTZ,
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "spr_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_equipment_quotation_summary" (
    "id" TEXT NOT NULL,
    "jo_id" TEXT,
    "jo_number" TEXT,
    "rv_id" TEXT,
    "rv_number" TEXT,
    "spr_id" TEXT,
    "spr_number" TEXT,
    "meqs_number" TEXT NOT NULL,
    "meqs_date" TIMESTAMPTZ NOT NULL,
    "notes" TEXT NOT NULL,
    "approval_status" INTEGER,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_by" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "cancelled_at" TIMESTAMPTZ,

    CONSTRAINT "material_equipment_quotation_summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meqs_supplier" (
    "id" TEXT NOT NULL,
    "meqs_id" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "payment_terms" TEXT NOT NULL,

    CONSTRAINT "meqs_supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meqs_supplier_item" (
    "id" TEXT NOT NULL,
    "meqs_supplier_id" TEXT NOT NULL,
    "canvass_item_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "notes" TEXT NOT NULL,
    "is_awarded" BOOLEAN NOT NULL DEFAULT false,
    "vat_type" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "meqs_supplier_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meqs_supplier_attachment" (
    "id" TEXT NOT NULL,
    "meqs_supplier_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL DEFAULT 'no_filename',
    "src" TEXT NOT NULL,

    CONSTRAINT "meqs_supplier_attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meqs_approver" (
    "id" TEXT NOT NULL,
    "meqs_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMPTZ,
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "meqs_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order" (
    "id" TEXT NOT NULL,
    "meqs_supplier_id" TEXT,
    "meqs_number" TEXT NOT NULL,
    "po_number" TEXT NOT NULL,
    "fund_source_id" TEXT,
    "po_date" TIMESTAMPTZ NOT NULL,
    "notes" TEXT NOT NULL,
    "approval_status" INTEGER,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "purchase_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "po_approver" (
    "id" TEXT NOT NULL,
    "po_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMPTZ,
    "notes" TEXT,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "po_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receiving_report" (
    "id" TEXT NOT NULL,
    "po_id" TEXT,
    "po_number" TEXT NOT NULL,
    "rr_number" TEXT NOT NULL,
    "rr_date" TIMESTAMPTZ NOT NULL,
    "received_by_id" TEXT NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "delivery_number" TEXT,
    "notes" TEXT NOT NULL,
    "delivery_charge" DOUBLE PRECISION NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "approval_status" INTEGER,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "receiving_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rr_approver" (
    "id" TEXT NOT NULL,
    "rr_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMPTZ,
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "rr_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rr_item" (
    "id" TEXT NOT NULL,
    "rr_id" TEXT NOT NULL,
    "meqs_supplier_item_id" TEXT NOT NULL,
    "quantity_accepted" INTEGER NOT NULL,

    CONSTRAINT "rr_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "osriv" (
    "id" TEXT NOT NULL,
    "osriv_number" TEXT NOT NULL,
    "date_requested" TIMESTAMPTZ NOT NULL,
    "exp_date" TIMESTAMPTZ NOT NULL,
    "purpose" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "approval_status" INTEGER,
    "requested_by_id" TEXT NOT NULL,
    "item_from_id" TEXT NOT NULL,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "osriv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "osriv_approver" (
    "id" TEXT NOT NULL,
    "osriv_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMPTZ,
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "osriv_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "osriv_item" (
    "id" TEXT NOT NULL,
    "osriv_id" TEXT NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "osriv_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seriv" (
    "id" TEXT NOT NULL,
    "seriv_number" TEXT NOT NULL,
    "date_requested" TIMESTAMPTZ NOT NULL,
    "exp_date" TIMESTAMPTZ NOT NULL,
    "purpose" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "approval_status" INTEGER,
    "request_type" INTEGER NOT NULL,
    "or_number" TEXT,
    "mwo_number" TEXT,
    "cwo_number" TEXT,
    "jo_number" TEXT,
    "consumer_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "requested_by_id" TEXT NOT NULL,
    "withdrawn_by_id" TEXT NOT NULL,
    "item_from_id" TEXT NOT NULL,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "seriv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seriv_approver" (
    "id" TEXT NOT NULL,
    "seriv_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMPTZ,
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "seriv_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seriv_item" (
    "id" TEXT NOT NULL,
    "seriv_id" TEXT NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "seriv_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mrv" (
    "id" TEXT NOT NULL,
    "project_id" UUID,
    "mrv_number" TEXT NOT NULL,
    "date_requested" TIMESTAMPTZ NOT NULL,
    "exp_date" TIMESTAMPTZ NOT NULL,
    "purpose" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "approval_status" INTEGER,
    "request_type" INTEGER NOT NULL,
    "or_number" TEXT,
    "mwo_number" TEXT,
    "cwo_number" TEXT,
    "jo_number" TEXT,
    "consumer_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "requested_by_id" TEXT NOT NULL,
    "withdrawn_by_id" TEXT NOT NULL,
    "item_from_id" TEXT NOT NULL,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "mrv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mrv_approver" (
    "id" TEXT NOT NULL,
    "mrv_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMPTZ,
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "mrv_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mrv_item" (
    "id" TEXT NOT NULL,
    "mrv_id" TEXT NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "mrv_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mct" (
    "id" TEXT NOT NULL,
    "mrv_id" TEXT,
    "mrv_number" TEXT NOT NULL,
    "mct_number" TEXT NOT NULL,
    "mct_date" TIMESTAMPTZ NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "approval_status" INTEGER,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "mct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mct_approver" (
    "id" TEXT NOT NULL,
    "mct_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMPTZ,
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "mct_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mcrt" (
    "id" TEXT NOT NULL,
    "mct_id" TEXT,
    "mct_number" TEXT,
    "seriv_id" TEXT,
    "seriv_number" TEXT,
    "mcrt_number" TEXT NOT NULL,
    "mcrt_date" TIMESTAMPTZ NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "approval_status" INTEGER,
    "returned_by_id" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "mcrt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mcrt_approver" (
    "id" TEXT NOT NULL,
    "mcrt_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMPTZ,
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "mcrt_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mcrt_item" (
    "id" TEXT NOT NULL,
    "mcrt_id" TEXT NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "mcrt_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mst" (
    "id" TEXT NOT NULL,
    "mst_number" TEXT NOT NULL,
    "mst_date" TIMESTAMPTZ NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "approval_status" INTEGER,
    "returned_by_id" TEXT NOT NULL,
    "cwo_number" TEXT,
    "mwo_number" TEXT,
    "jo_number" TEXT,
    "remarks" TEXT NOT NULL,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "mst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mst_approver" (
    "id" TEXT NOT NULL,
    "mst_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMPTZ,
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "mst_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mst_item" (
    "id" TEXT NOT NULL,
    "mst_id" TEXT NOT NULL,
    "item_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "mst_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle" (
    "id" TEXT NOT NULL,
    "vehicle_number" TEXT NOT NULL,
    "plate_number" TEXT NOT NULL,
    "rf_id" TEXT,
    "classification_id" INTEGER NOT NULL,
    "assignee_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date_acquired" TIMESTAMPTZ NOT NULL,
    "status" INTEGER NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_ticket" (
    "id" TEXT NOT NULL,
    "trip_number" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "passengers" TEXT,
    "destination" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "start_time" TIMESTAMPTZ NOT NULL,
    "end_time" TIMESTAMPTZ NOT NULL,
    "actual_start_time" TIMESTAMPTZ,
    "actual_end_time" TIMESTAMPTZ,
    "is_operation" BOOLEAN NOT NULL,
    "is_stay_in" BOOLEAN NOT NULL,
    "is_personal" BOOLEAN NOT NULL,
    "is_out_of_coverage" BOOLEAN NOT NULL,
    "prepared_by_id" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "trip_ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_ticket_approver" (
    "id" TEXT NOT NULL,
    "trip_ticket_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMPTZ,
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

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
    "approval_status" INTEGER,
    "with_container" BOOLEAN NOT NULL,
    "liter_in_text" TEXT NOT NULL,
    "actual_liter" DOUBLE PRECISION,
    "price_per_liter" DOUBLE PRECISION,
    "purpose" TEXT NOT NULL,
    "is_posted" BOOLEAN,
    "print_count" INTEGER NOT NULL DEFAULT 0,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "gas_slip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gas_slip_approver" (
    "id" TEXT NOT NULL,
    "gas_slip_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMPTZ,
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "gas_slip_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gas_station" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "gas_station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fuel_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "fuel_type_pkey" PRIMARY KEY ("id")
);

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
    "service_date" TIMESTAMPTZ NOT NULL,
    "service_mileage" INTEGER NOT NULL,
    "next_service_date" TIMESTAMPTZ NOT NULL,
    "next_service_mileage" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "remarks" TEXT NOT NULL,
    "performed_by" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

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
CREATE UNIQUE INDEX "item_type_code_key" ON "item_type"("code");

-- CreateIndex
CREATE INDEX "supplier_name_idx" ON "supplier"("name");

-- CreateIndex
CREATE INDEX "supplier_vat_type_idx" ON "supplier"("vat_type");

-- CreateIndex
CREATE INDEX "supplier_is_vat_registered_idx" ON "supplier"("is_vat_registered");

-- CreateIndex
CREATE INDEX "supplier_deleted_at_idx" ON "supplier"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "unit_name_key" ON "unit"("name");

-- CreateIndex
CREATE INDEX "pending_approver_id_idx" ON "pending"("approver_id");

-- CreateIndex
CREATE INDEX "pending_transaction_date_idx" ON "pending"("transaction_date");

-- CreateIndex
CREATE UNIQUE INDEX "pending_approver_id_reference_number_reference_table_key" ON "pending"("approver_id", "reference_number", "reference_table");

-- CreateIndex
CREATE UNIQUE INDEX "setting_key_key" ON "setting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "mwo_sequence_tracker_yearMonth_key" ON "mwo_sequence_tracker"("yearMonth");

-- CreateIndex
CREATE UNIQUE INDEX "item_code_key" ON "item"("code");

-- CreateIndex
CREATE INDEX "item_item_type_id_idx" ON "item"("item_type_id");

-- CreateIndex
CREATE INDEX "item_deleted_at_idx" ON "item"("deleted_at");

-- CreateIndex
CREATE INDEX "item_description_idx" ON "item"("description");

-- CreateIndex
CREATE INDEX "item_created_by_idx" ON "item"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "project_item_item_id_key" ON "project_item"("item_id");

-- CreateIndex
CREATE INDEX "project_item_project_id_idx" ON "project_item"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "item_transaction_rr_item_id_key" ON "item_transaction"("rr_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "item_transaction_osriv_item_id_key" ON "item_transaction"("osriv_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "item_transaction_seriv_item_id_key" ON "item_transaction"("seriv_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "item_transaction_mrv_item_id_key" ON "item_transaction"("mrv_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "item_transaction_mcrt_item_id_key" ON "item_transaction"("mcrt_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "item_transaction_mst_item_id_key" ON "item_transaction"("mst_item_id");

-- CreateIndex
CREATE INDEX "item_transaction_item_id_idx" ON "item_transaction"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "item_code_tracker_item_code_key" ON "item_code_tracker"("item_code");

-- CreateIndex
CREATE UNIQUE INDEX "canvass_rc_number_key" ON "canvass"("rc_number");

-- CreateIndex
CREATE INDEX "canvass_date_requested_requested_by_id_idx" ON "canvass"("date_requested", "requested_by_id");

-- CreateIndex
CREATE INDEX "canvass_requested_by_id_idx" ON "canvass"("requested_by_id");

-- CreateIndex
CREATE INDEX "canvass_date_requested_idx" ON "canvass"("date_requested");

-- CreateIndex
CREATE INDEX "canvass_item_canvass_id_idx" ON "canvass_item"("canvass_id");

-- CreateIndex
CREATE INDEX "canvass_item_item_id_idx" ON "canvass_item"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "request_voucher_rv_number_key" ON "request_voucher"("rv_number");

-- CreateIndex
CREATE UNIQUE INDEX "request_voucher_canvass_id_key" ON "request_voucher"("canvass_id");

-- CreateIndex
CREATE INDEX "request_voucher_date_requested_idx" ON "request_voucher"("date_requested");

-- CreateIndex
CREATE INDEX "request_voucher_approval_status_idx" ON "request_voucher"("approval_status");

-- CreateIndex
CREATE INDEX "request_voucher_created_by_idx" ON "request_voucher"("created_by");

-- CreateIndex
CREATE INDEX "rv_approver_approver_id_idx" ON "rv_approver"("approver_id");

-- CreateIndex
CREATE INDEX "rv_approver_rv_id_idx" ON "rv_approver"("rv_id");

-- CreateIndex
CREATE UNIQUE INDEX "rv_approver_rv_id_order_key" ON "rv_approver"("rv_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "job_order_jo_number_key" ON "job_order"("jo_number");

-- CreateIndex
CREATE UNIQUE INDEX "job_order_canvass_id_key" ON "job_order"("canvass_id");

-- CreateIndex
CREATE INDEX "job_order_date_requested_idx" ON "job_order"("date_requested");

-- CreateIndex
CREATE INDEX "job_order_approval_status_idx" ON "job_order"("approval_status");

-- CreateIndex
CREATE INDEX "job_order_created_by_idx" ON "job_order"("created_by");

-- CreateIndex
CREATE INDEX "jo_approver_approver_id_idx" ON "jo_approver"("approver_id");

-- CreateIndex
CREATE INDEX "jo_approver_jo_id_idx" ON "jo_approver"("jo_id");

-- CreateIndex
CREATE UNIQUE INDEX "jo_approver_jo_id_order_key" ON "jo_approver"("jo_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "spare_parts_request_spr_number_key" ON "spare_parts_request"("spr_number");

-- CreateIndex
CREATE UNIQUE INDEX "spare_parts_request_canvass_id_key" ON "spare_parts_request"("canvass_id");

-- CreateIndex
CREATE INDEX "spare_parts_request_date_requested_idx" ON "spare_parts_request"("date_requested");

-- CreateIndex
CREATE INDEX "spare_parts_request_approval_status_idx" ON "spare_parts_request"("approval_status");

-- CreateIndex
CREATE INDEX "spare_parts_request_created_by_idx" ON "spare_parts_request"("created_by");

-- CreateIndex
CREATE INDEX "spr_approver_approver_id_idx" ON "spr_approver"("approver_id");

-- CreateIndex
CREATE INDEX "spr_approver_spr_id_idx" ON "spr_approver"("spr_id");

-- CreateIndex
CREATE UNIQUE INDEX "spr_approver_spr_id_order_key" ON "spr_approver"("spr_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "material_equipment_quotation_summary_jo_id_key" ON "material_equipment_quotation_summary"("jo_id");

-- CreateIndex
CREATE UNIQUE INDEX "material_equipment_quotation_summary_rv_id_key" ON "material_equipment_quotation_summary"("rv_id");

-- CreateIndex
CREATE UNIQUE INDEX "material_equipment_quotation_summary_spr_id_key" ON "material_equipment_quotation_summary"("spr_id");

-- CreateIndex
CREATE UNIQUE INDEX "material_equipment_quotation_summary_meqs_number_key" ON "material_equipment_quotation_summary"("meqs_number");

-- CreateIndex
CREATE INDEX "material_equipment_quotation_summary_meqs_date_idx" ON "material_equipment_quotation_summary"("meqs_date");

-- CreateIndex
CREATE INDEX "material_equipment_quotation_summary_approval_status_idx" ON "material_equipment_quotation_summary"("approval_status");

-- CreateIndex
CREATE INDEX "material_equipment_quotation_summary_created_by_idx" ON "material_equipment_quotation_summary"("created_by");

-- CreateIndex
CREATE INDEX "meqs_supplier_meqs_id_idx" ON "meqs_supplier"("meqs_id");

-- CreateIndex
CREATE INDEX "meqs_supplier_supplier_id_idx" ON "meqs_supplier"("supplier_id");

-- CreateIndex
CREATE UNIQUE INDEX "meqs_supplier_meqs_id_supplier_id_key" ON "meqs_supplier"("meqs_id", "supplier_id");

-- CreateIndex
CREATE INDEX "meqs_supplier_item_meqs_supplier_id_idx" ON "meqs_supplier_item"("meqs_supplier_id");

-- CreateIndex
CREATE INDEX "meqs_supplier_item_canvass_item_id_idx" ON "meqs_supplier_item"("canvass_item_id");

-- CreateIndex
CREATE INDEX "meqs_supplier_attachment_meqs_supplier_id_idx" ON "meqs_supplier_attachment"("meqs_supplier_id");

-- CreateIndex
CREATE INDEX "meqs_approver_meqs_id_idx" ON "meqs_approver"("meqs_id");

-- CreateIndex
CREATE INDEX "meqs_approver_approver_id_idx" ON "meqs_approver"("approver_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_order_meqs_supplier_id_key" ON "purchase_order"("meqs_supplier_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_order_po_number_key" ON "purchase_order"("po_number");

-- CreateIndex
CREATE INDEX "purchase_order_po_date_idx" ON "purchase_order"("po_date");

-- CreateIndex
CREATE INDEX "purchase_order_created_by_idx" ON "purchase_order"("created_by");

-- CreateIndex
CREATE INDEX "purchase_order_approval_status_idx" ON "purchase_order"("approval_status");

-- CreateIndex
CREATE INDEX "po_approver_approver_id_idx" ON "po_approver"("approver_id");

-- CreateIndex
CREATE INDEX "po_approver_po_id_idx" ON "po_approver"("po_id");

-- CreateIndex
CREATE UNIQUE INDEX "receiving_report_rr_number_key" ON "receiving_report"("rr_number");

-- CreateIndex
CREATE UNIQUE INDEX "receiving_report_invoice_number_key" ON "receiving_report"("invoice_number");

-- CreateIndex
CREATE INDEX "receiving_report_po_id_idx" ON "receiving_report"("po_id");

-- CreateIndex
CREATE INDEX "receiving_report_approval_status_idx" ON "receiving_report"("approval_status");

-- CreateIndex
CREATE INDEX "receiving_report_rr_date_idx" ON "receiving_report"("rr_date");

-- CreateIndex
CREATE INDEX "receiving_report_created_by_idx" ON "receiving_report"("created_by");

-- CreateIndex
CREATE INDEX "rr_approver_approver_id_idx" ON "rr_approver"("approver_id");

-- CreateIndex
CREATE INDEX "rr_approver_rr_id_idx" ON "rr_approver"("rr_id");

-- CreateIndex
CREATE INDEX "rr_item_rr_id_idx" ON "rr_item"("rr_id");

-- CreateIndex
CREATE INDEX "rr_item_meqs_supplier_item_id_idx" ON "rr_item"("meqs_supplier_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "osriv_osriv_number_key" ON "osriv"("osriv_number");

-- CreateIndex
CREATE INDEX "osriv_date_requested_idx" ON "osriv"("date_requested");

-- CreateIndex
CREATE INDEX "osriv_requested_by_id_idx" ON "osriv"("requested_by_id");

-- CreateIndex
CREATE INDEX "osriv_item_from_id_idx" ON "osriv"("item_from_id");

-- CreateIndex
CREATE INDEX "osriv_approval_status_idx" ON "osriv"("approval_status");

-- CreateIndex
CREATE INDEX "osriv_created_by_idx" ON "osriv"("created_by");

-- CreateIndex
CREATE INDEX "osriv_approver_osriv_id_idx" ON "osriv_approver"("osriv_id");

-- CreateIndex
CREATE INDEX "osriv_approver_approver_id_idx" ON "osriv_approver"("approver_id");

-- CreateIndex
CREATE UNIQUE INDEX "osriv_approver_osriv_id_order_key" ON "osriv_approver"("osriv_id", "order");

-- CreateIndex
CREATE INDEX "osriv_item_osriv_id_idx" ON "osriv_item"("osriv_id");

-- CreateIndex
CREATE INDEX "osriv_item_item_id_idx" ON "osriv_item"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "seriv_seriv_number_key" ON "seriv"("seriv_number");

-- CreateIndex
CREATE UNIQUE INDEX "seriv_mwo_number_key" ON "seriv"("mwo_number");

-- CreateIndex
CREATE INDEX "seriv_approval_status_idx" ON "seriv"("approval_status");

-- CreateIndex
CREATE INDEX "seriv_date_requested_idx" ON "seriv"("date_requested");

-- CreateIndex
CREATE INDEX "seriv_requested_by_id_idx" ON "seriv"("requested_by_id");

-- CreateIndex
CREATE INDEX "seriv_item_from_id_idx" ON "seriv"("item_from_id");

-- CreateIndex
CREATE INDEX "seriv_created_by_idx" ON "seriv"("created_by");

-- CreateIndex
CREATE INDEX "seriv_approver_seriv_id_idx" ON "seriv_approver"("seriv_id");

-- CreateIndex
CREATE INDEX "seriv_approver_approver_id_idx" ON "seriv_approver"("approver_id");

-- CreateIndex
CREATE UNIQUE INDEX "seriv_approver_seriv_id_order_key" ON "seriv_approver"("seriv_id", "order");

-- CreateIndex
CREATE INDEX "seriv_item_seriv_id_idx" ON "seriv_item"("seriv_id");

-- CreateIndex
CREATE INDEX "seriv_item_item_id_idx" ON "seriv_item"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "mrv_mrv_number_key" ON "mrv"("mrv_number");

-- CreateIndex
CREATE UNIQUE INDEX "mrv_mwo_number_key" ON "mrv"("mwo_number");

-- CreateIndex
CREATE INDEX "mrv_date_requested_idx" ON "mrv"("date_requested");

-- CreateIndex
CREATE INDEX "mrv_project_id_idx" ON "mrv"("project_id");

-- CreateIndex
CREATE INDEX "mrv_approval_status_idx" ON "mrv"("approval_status");

-- CreateIndex
CREATE INDEX "mrv_request_type_idx" ON "mrv"("request_type");

-- CreateIndex
CREATE INDEX "mrv_requested_by_id_idx" ON "mrv"("requested_by_id");

-- CreateIndex
CREATE INDEX "mrv_item_from_id_idx" ON "mrv"("item_from_id");

-- CreateIndex
CREATE INDEX "mrv_created_by_idx" ON "mrv"("created_by");

-- CreateIndex
CREATE INDEX "mrv_approver_mrv_id_idx" ON "mrv_approver"("mrv_id");

-- CreateIndex
CREATE INDEX "mrv_approver_approver_id_idx" ON "mrv_approver"("approver_id");

-- CreateIndex
CREATE UNIQUE INDEX "mrv_approver_mrv_id_order_key" ON "mrv_approver"("mrv_id", "order");

-- CreateIndex
CREATE INDEX "mrv_item_mrv_id_idx" ON "mrv_item"("mrv_id");

-- CreateIndex
CREATE INDEX "mrv_item_item_id_idx" ON "mrv_item"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "mct_mrv_id_key" ON "mct"("mrv_id");

-- CreateIndex
CREATE UNIQUE INDEX "mct_mct_number_key" ON "mct"("mct_number");

-- CreateIndex
CREATE INDEX "mct_mrv_id_idx" ON "mct"("mrv_id");

-- CreateIndex
CREATE INDEX "mct_mct_date_idx" ON "mct"("mct_date");

-- CreateIndex
CREATE INDEX "mct_approval_status_idx" ON "mct"("approval_status");

-- CreateIndex
CREATE INDEX "mct_created_by_idx" ON "mct"("created_by");

-- CreateIndex
CREATE INDEX "mct_approver_mct_id_idx" ON "mct_approver"("mct_id");

-- CreateIndex
CREATE INDEX "mct_approver_approver_id_idx" ON "mct_approver"("approver_id");

-- CreateIndex
CREATE UNIQUE INDEX "mct_approver_mct_id_order_key" ON "mct_approver"("mct_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "mcrt_mcrt_number_key" ON "mcrt"("mcrt_number");

-- CreateIndex
CREATE INDEX "mcrt_mcrt_date_idx" ON "mcrt"("mcrt_date");

-- CreateIndex
CREATE INDEX "mcrt_seriv_id_idx" ON "mcrt"("seriv_id");

-- CreateIndex
CREATE INDEX "mcrt_mct_id_idx" ON "mcrt"("mct_id");

-- CreateIndex
CREATE INDEX "mcrt_approval_status_idx" ON "mcrt"("approval_status");

-- CreateIndex
CREATE INDEX "mcrt_created_by_idx" ON "mcrt"("created_by");

-- CreateIndex
CREATE INDEX "mcrt_approver_mcrt_id_idx" ON "mcrt_approver"("mcrt_id");

-- CreateIndex
CREATE INDEX "mcrt_approver_approver_id_idx" ON "mcrt_approver"("approver_id");

-- CreateIndex
CREATE UNIQUE INDEX "mcrt_approver_mcrt_id_order_key" ON "mcrt_approver"("mcrt_id", "order");

-- CreateIndex
CREATE INDEX "mcrt_item_mcrt_id_idx" ON "mcrt_item"("mcrt_id");

-- CreateIndex
CREATE INDEX "mcrt_item_item_id_idx" ON "mcrt_item"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "mst_mst_number_key" ON "mst"("mst_number");

-- CreateIndex
CREATE INDEX "mst_mst_date_idx" ON "mst"("mst_date");

-- CreateIndex
CREATE INDEX "mst_approval_status_idx" ON "mst"("approval_status");

-- CreateIndex
CREATE INDEX "mst_returned_by_id_idx" ON "mst"("returned_by_id");

-- CreateIndex
CREATE INDEX "mst_created_at_idx" ON "mst"("created_at");

-- CreateIndex
CREATE INDEX "mst_approver_mst_id_idx" ON "mst_approver"("mst_id");

-- CreateIndex
CREATE INDEX "mst_approver_approver_id_idx" ON "mst_approver"("approver_id");

-- CreateIndex
CREATE UNIQUE INDEX "mst_approver_mst_id_order_key" ON "mst_approver"("mst_id", "order");

-- CreateIndex
CREATE INDEX "mst_item_mst_id_idx" ON "mst_item"("mst_id");

-- CreateIndex
CREATE INDEX "mst_item_item_id_idx" ON "mst_item"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_vehicle_number_key" ON "vehicle"("vehicle_number");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_plate_number_key" ON "vehicle"("plate_number");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_rf_id_key" ON "vehicle"("rf_id");

-- CreateIndex
CREATE INDEX "vehicle_assignee_id_idx" ON "vehicle"("assignee_id");

-- CreateIndex
CREATE INDEX "vehicle_classification_id_idx" ON "vehicle"("classification_id");

-- CreateIndex
CREATE INDEX "vehicle_deleted_at_idx" ON "vehicle"("deleted_at");

-- CreateIndex
CREATE INDEX "vehicle_date_acquired_idx" ON "vehicle"("date_acquired");

-- CreateIndex
CREATE INDEX "vehicle_name_idx" ON "vehicle"("name");

-- CreateIndex
CREATE INDEX "vehicle_status_idx" ON "vehicle"("status");

-- CreateIndex
CREATE INDEX "vehicle_created_by_idx" ON "vehicle"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "trip_ticket_trip_number_key" ON "trip_ticket"("trip_number");

-- CreateIndex
CREATE INDEX "trip_ticket_start_time_end_time_idx" ON "trip_ticket"("start_time", "end_time");

-- CreateIndex
CREATE INDEX "trip_ticket_vehicle_id_idx" ON "trip_ticket"("vehicle_id");

-- CreateIndex
CREATE INDEX "trip_ticket_driver_id_idx" ON "trip_ticket"("driver_id");

-- CreateIndex
CREATE INDEX "trip_ticket_prepared_by_id_idx" ON "trip_ticket"("prepared_by_id");

-- CreateIndex
CREATE INDEX "trip_ticket_status_idx" ON "trip_ticket"("status");

-- CreateIndex
CREATE INDEX "trip_ticket_created_by_idx" ON "trip_ticket"("created_by");

-- CreateIndex
CREATE INDEX "trip_ticket_cancelled_at_idx" ON "trip_ticket"("cancelled_at");

-- CreateIndex
CREATE INDEX "trip_ticket_start_time_idx" ON "trip_ticket"("start_time");

-- CreateIndex
CREATE INDEX "trip_ticket_approver_trip_ticket_id_idx" ON "trip_ticket_approver"("trip_ticket_id");

-- CreateIndex
CREATE INDEX "trip_ticket_approver_approver_id_idx" ON "trip_ticket_approver"("approver_id");

-- CreateIndex
CREATE UNIQUE INDEX "trip_ticket_approver_trip_ticket_id_order_key" ON "trip_ticket_approver"("trip_ticket_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "gas_slip_gas_slip_number_key" ON "gas_slip"("gas_slip_number");

-- CreateIndex
CREATE INDEX "gas_slip_vehicle_id_idx" ON "gas_slip"("vehicle_id");

-- CreateIndex
CREATE INDEX "gas_slip_driver_id_idx" ON "gas_slip"("driver_id");

-- CreateIndex
CREATE INDEX "gas_slip_gas_station_id_idx" ON "gas_slip"("gas_station_id");

-- CreateIndex
CREATE INDEX "gas_slip_requested_by_id_idx" ON "gas_slip"("requested_by_id");

-- CreateIndex
CREATE INDEX "gas_slip_fuel_type_id_idx" ON "gas_slip"("fuel_type_id");

-- CreateIndex
CREATE INDEX "gas_slip_approval_status_idx" ON "gas_slip"("approval_status");

-- CreateIndex
CREATE INDEX "gas_slip_is_posted_idx" ON "gas_slip"("is_posted");

-- CreateIndex
CREATE INDEX "gas_slip_created_by_idx" ON "gas_slip"("created_by");

-- CreateIndex
CREATE INDEX "gas_slip_approver_gas_slip_id_idx" ON "gas_slip_approver"("gas_slip_id");

-- CreateIndex
CREATE INDEX "gas_slip_approver_approver_id_idx" ON "gas_slip_approver"("approver_id");

-- CreateIndex
CREATE UNIQUE INDEX "gas_slip_approver_gas_slip_id_order_key" ON "gas_slip_approver"("gas_slip_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "service_center_name_key" ON "service_center"("name");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_maintenance_ref_number_key" ON "vehicle_maintenance"("ref_number");

-- CreateIndex
CREATE INDEX "vehicle_maintenance_vehicle_id_idx" ON "vehicle_maintenance"("vehicle_id");

-- CreateIndex
CREATE INDEX "vehicle_maintenance_service_center_id_idx" ON "vehicle_maintenance"("service_center_id");

-- CreateIndex
CREATE INDEX "vehicle_maintenance_created_by_idx" ON "vehicle_maintenance"("created_by");

-- CreateIndex
CREATE INDEX "vehicle_maintenance_service_date_idx" ON "vehicle_maintenance"("service_date");

-- CreateIndex
CREATE INDEX "vehicle_maintenance_is_completed_idx" ON "vehicle_maintenance"("is_completed");

-- CreateIndex
CREATE INDEX "vehicle_maintenance_detail_maintenance_id_idx" ON "vehicle_maintenance_detail"("maintenance_id");

-- CreateIndex
CREATE INDEX "vehicle_maintenance_detail_service_id_idx" ON "vehicle_maintenance_detail"("service_id");

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_item_type_id_fkey" FOREIGN KEY ("item_type_id") REFERENCES "item_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_item" ADD CONSTRAINT "project_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_item" ADD CONSTRAINT "project_item_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_location" ADD CONSTRAINT "item_location_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_location" ADD CONSTRAINT "item_location_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_movement" ADD CONSTRAINT "item_movement_origin_id_fkey" FOREIGN KEY ("origin_id") REFERENCES "item_location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_movement" ADD CONSTRAINT "item_movement_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "item_location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_transaction" ADD CONSTRAINT "item_transaction_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_transaction" ADD CONSTRAINT "item_transaction_rr_item_id_fkey" FOREIGN KEY ("rr_item_id") REFERENCES "rr_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_transaction" ADD CONSTRAINT "item_transaction_osriv_item_id_fkey" FOREIGN KEY ("osriv_item_id") REFERENCES "osriv_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_transaction" ADD CONSTRAINT "item_transaction_seriv_item_id_fkey" FOREIGN KEY ("seriv_item_id") REFERENCES "seriv_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_transaction" ADD CONSTRAINT "item_transaction_mrv_item_id_fkey" FOREIGN KEY ("mrv_item_id") REFERENCES "mrv_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_transaction" ADD CONSTRAINT "item_transaction_mcrt_item_id_fkey" FOREIGN KEY ("mcrt_item_id") REFERENCES "mcrt_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_transaction" ADD CONSTRAINT "item_transaction_mst_item_id_fkey" FOREIGN KEY ("mst_item_id") REFERENCES "mst_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canvass_item" ADD CONSTRAINT "canvass_item_canvass_id_fkey" FOREIGN KEY ("canvass_id") REFERENCES "canvass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canvass_item" ADD CONSTRAINT "canvass_item_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canvass_item" ADD CONSTRAINT "canvass_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_voucher" ADD CONSTRAINT "request_voucher_canvass_id_fkey" FOREIGN KEY ("canvass_id") REFERENCES "canvass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rv_approver" ADD CONSTRAINT "rv_approver_rv_id_fkey" FOREIGN KEY ("rv_id") REFERENCES "request_voucher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_order" ADD CONSTRAINT "job_order_canvass_id_fkey" FOREIGN KEY ("canvass_id") REFERENCES "canvass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jo_approver" ADD CONSTRAINT "jo_approver_jo_id_fkey" FOREIGN KEY ("jo_id") REFERENCES "job_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spare_parts_request" ADD CONSTRAINT "spare_parts_request_canvass_id_fkey" FOREIGN KEY ("canvass_id") REFERENCES "canvass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spare_parts_request" ADD CONSTRAINT "spare_parts_request_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spr_approver" ADD CONSTRAINT "spr_approver_spr_id_fkey" FOREIGN KEY ("spr_id") REFERENCES "spare_parts_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_equipment_quotation_summary" ADD CONSTRAINT "material_equipment_quotation_summary_jo_id_fkey" FOREIGN KEY ("jo_id") REFERENCES "job_order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_equipment_quotation_summary" ADD CONSTRAINT "material_equipment_quotation_summary_rv_id_fkey" FOREIGN KEY ("rv_id") REFERENCES "request_voucher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_equipment_quotation_summary" ADD CONSTRAINT "material_equipment_quotation_summary_spr_id_fkey" FOREIGN KEY ("spr_id") REFERENCES "spare_parts_request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meqs_supplier" ADD CONSTRAINT "meqs_supplier_meqs_id_fkey" FOREIGN KEY ("meqs_id") REFERENCES "material_equipment_quotation_summary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meqs_supplier" ADD CONSTRAINT "meqs_supplier_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meqs_supplier_item" ADD CONSTRAINT "meqs_supplier_item_canvass_item_id_fkey" FOREIGN KEY ("canvass_item_id") REFERENCES "canvass_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meqs_supplier_item" ADD CONSTRAINT "meqs_supplier_item_meqs_supplier_id_fkey" FOREIGN KEY ("meqs_supplier_id") REFERENCES "meqs_supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meqs_supplier_attachment" ADD CONSTRAINT "meqs_supplier_attachment_meqs_supplier_id_fkey" FOREIGN KEY ("meqs_supplier_id") REFERENCES "meqs_supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meqs_approver" ADD CONSTRAINT "meqs_approver_meqs_id_fkey" FOREIGN KEY ("meqs_id") REFERENCES "material_equipment_quotation_summary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order" ADD CONSTRAINT "purchase_order_meqs_supplier_id_fkey" FOREIGN KEY ("meqs_supplier_id") REFERENCES "meqs_supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "po_approver" ADD CONSTRAINT "po_approver_po_id_fkey" FOREIGN KEY ("po_id") REFERENCES "purchase_order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receiving_report" ADD CONSTRAINT "receiving_report_po_id_fkey" FOREIGN KEY ("po_id") REFERENCES "purchase_order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rr_approver" ADD CONSTRAINT "rr_approver_rr_id_fkey" FOREIGN KEY ("rr_id") REFERENCES "receiving_report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rr_item" ADD CONSTRAINT "rr_item_rr_id_fkey" FOREIGN KEY ("rr_id") REFERENCES "receiving_report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rr_item" ADD CONSTRAINT "rr_item_meqs_supplier_item_id_fkey" FOREIGN KEY ("meqs_supplier_item_id") REFERENCES "meqs_supplier_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osriv" ADD CONSTRAINT "osriv_item_from_id_fkey" FOREIGN KEY ("item_from_id") REFERENCES "station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osriv_approver" ADD CONSTRAINT "osriv_approver_osriv_id_fkey" FOREIGN KEY ("osriv_id") REFERENCES "osriv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osriv_item" ADD CONSTRAINT "osriv_item_osriv_id_fkey" FOREIGN KEY ("osriv_id") REFERENCES "osriv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osriv_item" ADD CONSTRAINT "osriv_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seriv" ADD CONSTRAINT "seriv_item_from_id_fkey" FOREIGN KEY ("item_from_id") REFERENCES "station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seriv_approver" ADD CONSTRAINT "seriv_approver_seriv_id_fkey" FOREIGN KEY ("seriv_id") REFERENCES "seriv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seriv_item" ADD CONSTRAINT "seriv_item_seriv_id_fkey" FOREIGN KEY ("seriv_id") REFERENCES "seriv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seriv_item" ADD CONSTRAINT "seriv_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mrv" ADD CONSTRAINT "mrv_item_from_id_fkey" FOREIGN KEY ("item_from_id") REFERENCES "station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mrv" ADD CONSTRAINT "mrv_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mrv_approver" ADD CONSTRAINT "mrv_approver_mrv_id_fkey" FOREIGN KEY ("mrv_id") REFERENCES "mrv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mrv_item" ADD CONSTRAINT "mrv_item_mrv_id_fkey" FOREIGN KEY ("mrv_id") REFERENCES "mrv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mrv_item" ADD CONSTRAINT "mrv_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mct" ADD CONSTRAINT "mct_mrv_id_fkey" FOREIGN KEY ("mrv_id") REFERENCES "mrv"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mct_approver" ADD CONSTRAINT "mct_approver_mct_id_fkey" FOREIGN KEY ("mct_id") REFERENCES "mct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mcrt" ADD CONSTRAINT "mcrt_mct_id_fkey" FOREIGN KEY ("mct_id") REFERENCES "mct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mcrt" ADD CONSTRAINT "mcrt_seriv_id_fkey" FOREIGN KEY ("seriv_id") REFERENCES "seriv"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mcrt_approver" ADD CONSTRAINT "mcrt_approver_mcrt_id_fkey" FOREIGN KEY ("mcrt_id") REFERENCES "mcrt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mcrt_item" ADD CONSTRAINT "mcrt_item_mcrt_id_fkey" FOREIGN KEY ("mcrt_id") REFERENCES "mcrt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mcrt_item" ADD CONSTRAINT "mcrt_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mst_approver" ADD CONSTRAINT "mst_approver_mst_id_fkey" FOREIGN KEY ("mst_id") REFERENCES "mst"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mst_item" ADD CONSTRAINT "mst_item_mst_id_fkey" FOREIGN KEY ("mst_id") REFERENCES "mst"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mst_item" ADD CONSTRAINT "mst_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "vehicle_maintenance" ADD CONSTRAINT "vehicle_maintenance_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_maintenance" ADD CONSTRAINT "vehicle_maintenance_service_center_id_fkey" FOREIGN KEY ("service_center_id") REFERENCES "service_center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_maintenance_detail" ADD CONSTRAINT "vehicle_maintenance_detail_maintenance_id_fkey" FOREIGN KEY ("maintenance_id") REFERENCES "vehicle_maintenance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_maintenance_detail" ADD CONSTRAINT "vehicle_maintenance_detail_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "vehicle_service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
