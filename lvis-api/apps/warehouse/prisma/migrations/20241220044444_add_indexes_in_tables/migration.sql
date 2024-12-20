-- DropIndex
DROP INDEX "canvass_item_canvass_id_unit_id_item_id_idx";

-- DropIndex
DROP INDEX "gas_slip_vehicle_id_driver_id_gas_station_id_requested_by_i_idx";

-- DropIndex
DROP INDEX "item_item_type_id_unit_id_created_by_idx";

-- DropIndex
DROP INDEX "mcrt_item_mcrt_id_item_id_idx";

-- DropIndex
DROP INDEX "mct_mrv_id_mct_date_idx";

-- DropIndex
DROP INDEX "meqs_supplier_meqs_id_supplier_id_idx";

-- DropIndex
DROP INDEX "meqs_supplier_item_meqs_supplier_id_canvass_item_id_idx";

-- DropIndex
DROP INDEX "mrv_item_mrv_id_item_id_idx";

-- DropIndex
DROP INDEX "mst_item_mst_id_item_id_idx";

-- DropIndex
DROP INDEX "osriv_item_osriv_id_item_id_idx";

-- DropIndex
DROP INDEX "pending_reference_number_approver_id_reference_table_transa_idx";

-- DropIndex
DROP INDEX "receiving_report_po_id_rr_date_idx";

-- DropIndex
DROP INDEX "rr_item_rr_id_meqs_supplier_item_id_idx";

-- DropIndex
DROP INDEX "seriv_item_seriv_id_item_id_idx";

-- DropIndex
DROP INDEX "trip_ticket_start_time_end_time_actual_start_time_actual_en_idx";

-- DropIndex
DROP INDEX "vehicle_assignee_id_classification_id_status_idx";

-- CreateIndex
CREATE INDEX "canvass_requested_by_id_idx" ON "canvass"("requested_by_id");

-- CreateIndex
CREATE INDEX "canvass_date_requested_idx" ON "canvass"("date_requested");

-- CreateIndex
CREATE INDEX "canvass_item_canvass_id_idx" ON "canvass_item"("canvass_id");

-- CreateIndex
CREATE INDEX "canvass_item_item_id_idx" ON "canvass_item"("item_id");

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
CREATE INDEX "gas_slip_approver_approver_id_idx" ON "gas_slip_approver"("approver_id");

-- CreateIndex
CREATE INDEX "item_item_type_id_idx" ON "item"("item_type_id");

-- CreateIndex
CREATE INDEX "item_deleted_at_idx" ON "item"("deleted_at");

-- CreateIndex
CREATE INDEX "item_description_idx" ON "item"("description");

-- CreateIndex
CREATE INDEX "item_created_by_idx" ON "item"("created_by");

-- CreateIndex
CREATE INDEX "jo_approver_approver_id_idx" ON "jo_approver"("approver_id");

-- CreateIndex
CREATE INDEX "job_order_approval_status_idx" ON "job_order"("approval_status");

-- CreateIndex
CREATE INDEX "job_order_created_by_idx" ON "job_order"("created_by");

-- CreateIndex
CREATE INDEX "material_equipment_quotation_summary_approval_status_idx" ON "material_equipment_quotation_summary"("approval_status");

-- CreateIndex
CREATE INDEX "material_equipment_quotation_summary_created_by_idx" ON "material_equipment_quotation_summary"("created_by");

-- CreateIndex
CREATE INDEX "mcrt_seriv_id_idx" ON "mcrt"("seriv_id");

-- CreateIndex
CREATE INDEX "mcrt_mct_id_idx" ON "mcrt"("mct_id");

-- CreateIndex
CREATE INDEX "mcrt_approval_status_idx" ON "mcrt"("approval_status");

-- CreateIndex
CREATE INDEX "mcrt_created_by_idx" ON "mcrt"("created_by");

-- CreateIndex
CREATE INDEX "mcrt_approver_approver_id_idx" ON "mcrt_approver"("approver_id");

-- CreateIndex
CREATE INDEX "mcrt_item_mcrt_id_idx" ON "mcrt_item"("mcrt_id");

-- CreateIndex
CREATE INDEX "mcrt_item_item_id_idx" ON "mcrt_item"("item_id");

-- CreateIndex
CREATE INDEX "mct_mrv_id_idx" ON "mct"("mrv_id");

-- CreateIndex
CREATE INDEX "mct_mct_date_idx" ON "mct"("mct_date");

-- CreateIndex
CREATE INDEX "mct_approval_status_idx" ON "mct"("approval_status");

-- CreateIndex
CREATE INDEX "mct_created_by_idx" ON "mct"("created_by");

-- CreateIndex
CREATE INDEX "mct_approver_approver_id_idx" ON "mct_approver"("approver_id");

-- CreateIndex
CREATE INDEX "meqs_approver_approver_id_idx" ON "meqs_approver"("approver_id");

-- CreateIndex
CREATE INDEX "meqs_supplier_meqs_id_idx" ON "meqs_supplier"("meqs_id");

-- CreateIndex
CREATE INDEX "meqs_supplier_supplier_id_idx" ON "meqs_supplier"("supplier_id");

-- CreateIndex
CREATE INDEX "meqs_supplier_item_meqs_supplier_id_idx" ON "meqs_supplier_item"("meqs_supplier_id");

-- CreateIndex
CREATE INDEX "meqs_supplier_item_canvass_item_id_idx" ON "meqs_supplier_item"("canvass_item_id");

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
CREATE INDEX "mrv_approver_approver_id_idx" ON "mrv_approver"("approver_id");

-- CreateIndex
CREATE INDEX "mrv_item_mrv_id_idx" ON "mrv_item"("mrv_id");

-- CreateIndex
CREATE INDEX "mrv_item_item_id_idx" ON "mrv_item"("item_id");

-- CreateIndex
CREATE INDEX "mst_approval_status_idx" ON "mst"("approval_status");

-- CreateIndex
CREATE INDEX "mst_returned_by_id_idx" ON "mst"("returned_by_id");

-- CreateIndex
CREATE INDEX "mst_created_at_idx" ON "mst"("created_at");

-- CreateIndex
CREATE INDEX "mst_approver_approver_id_idx" ON "mst_approver"("approver_id");

-- CreateIndex
CREATE INDEX "mst_item_mst_id_idx" ON "mst_item"("mst_id");

-- CreateIndex
CREATE INDEX "mst_item_item_id_idx" ON "mst_item"("item_id");

-- CreateIndex
CREATE INDEX "osriv_requested_by_id_idx" ON "osriv"("requested_by_id");

-- CreateIndex
CREATE INDEX "osriv_item_from_id_idx" ON "osriv"("item_from_id");

-- CreateIndex
CREATE INDEX "osriv_approval_status_idx" ON "osriv"("approval_status");

-- CreateIndex
CREATE INDEX "osriv_created_by_idx" ON "osriv"("created_by");

-- CreateIndex
CREATE INDEX "osriv_approver_approver_id_idx" ON "osriv_approver"("approver_id");

-- CreateIndex
CREATE INDEX "osriv_item_osriv_id_idx" ON "osriv_item"("osriv_id");

-- CreateIndex
CREATE INDEX "osriv_item_item_id_idx" ON "osriv_item"("item_id");

-- CreateIndex
CREATE INDEX "pending_approver_id_idx" ON "pending"("approver_id");

-- CreateIndex
CREATE INDEX "pending_transaction_date_idx" ON "pending"("transaction_date");

-- CreateIndex
CREATE INDEX "po_approver_approver_id_idx" ON "po_approver"("approver_id");

-- CreateIndex
CREATE INDEX "purchase_order_created_by_idx" ON "purchase_order"("created_by");

-- CreateIndex
CREATE INDEX "purchase_order_approval_status_idx" ON "purchase_order"("approval_status");

-- CreateIndex
CREATE INDEX "receiving_report_po_id_idx" ON "receiving_report"("po_id");

-- CreateIndex
CREATE INDEX "receiving_report_approval_status_idx" ON "receiving_report"("approval_status");

-- CreateIndex
CREATE INDEX "receiving_report_rr_date_idx" ON "receiving_report"("rr_date");

-- CreateIndex
CREATE INDEX "receiving_report_created_by_idx" ON "receiving_report"("created_by");

-- CreateIndex
CREATE INDEX "request_voucher_approval_status_idx" ON "request_voucher"("approval_status");

-- CreateIndex
CREATE INDEX "request_voucher_created_by_idx" ON "request_voucher"("created_by");

-- CreateIndex
CREATE INDEX "rr_approver_approver_id_idx" ON "rr_approver"("approver_id");

-- CreateIndex
CREATE INDEX "rr_item_rr_id_idx" ON "rr_item"("rr_id");

-- CreateIndex
CREATE INDEX "rr_item_meqs_supplier_item_id_idx" ON "rr_item"("meqs_supplier_item_id");

-- CreateIndex
CREATE INDEX "rv_approver_approver_id_idx" ON "rv_approver"("approver_id");

-- CreateIndex
CREATE INDEX "seriv_approval_status_idx" ON "seriv"("approval_status");

-- CreateIndex
CREATE INDEX "seriv_requested_by_id_idx" ON "seriv"("requested_by_id");

-- CreateIndex
CREATE INDEX "seriv_item_from_id_idx" ON "seriv"("item_from_id");

-- CreateIndex
CREATE INDEX "seriv_created_by_idx" ON "seriv"("created_by");

-- CreateIndex
CREATE INDEX "seriv_approver_approver_id_idx" ON "seriv_approver"("approver_id");

-- CreateIndex
CREATE INDEX "seriv_item_seriv_id_idx" ON "seriv_item"("seriv_id");

-- CreateIndex
CREATE INDEX "seriv_item_item_id_idx" ON "seriv_item"("item_id");

-- CreateIndex
CREATE INDEX "spare_parts_request_approval_status_idx" ON "spare_parts_request"("approval_status");

-- CreateIndex
CREATE INDEX "spare_parts_request_created_by_idx" ON "spare_parts_request"("created_by");

-- CreateIndex
CREATE INDEX "spr_approver_approver_id_idx" ON "spr_approver"("approver_id");

-- CreateIndex
CREATE INDEX "supplier_vat_type_idx" ON "supplier"("vat_type");

-- CreateIndex
CREATE INDEX "supplier_is_vat_registered_idx" ON "supplier"("is_vat_registered");

-- CreateIndex
CREATE INDEX "supplier_deleted_at_idx" ON "supplier"("deleted_at");

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
CREATE INDEX "trip_ticket_approver_approver_id_idx" ON "trip_ticket_approver"("approver_id");

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
CREATE INDEX "vehicle_maintenance_service_center_id_idx" ON "vehicle_maintenance"("service_center_id");

-- CreateIndex
CREATE INDEX "vehicle_maintenance_created_by_idx" ON "vehicle_maintenance"("created_by");

-- CreateIndex
CREATE INDEX "vehicle_maintenance_service_date_idx" ON "vehicle_maintenance"("service_date");

-- CreateIndex
CREATE INDEX "vehicle_maintenance_detail_maintenance_id_idx" ON "vehicle_maintenance_detail"("maintenance_id");

-- CreateIndex
CREATE INDEX "vehicle_maintenance_detail_service_id_idx" ON "vehicle_maintenance_detail"("service_id");
