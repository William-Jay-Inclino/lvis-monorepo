-- DropIndex
DROP INDEX "gas_slip_is_posted_idx";

-- DropIndex
DROP INDEX "item_description_idx";

-- DropIndex
DROP INDEX "mct_mrv_id_idx";

-- DropIndex
DROP INDEX "supplier_is_vat_registered_idx";

-- DropIndex
DROP INDEX "supplier_name_idx";

-- DropIndex
DROP INDEX "trip_ticket_cancelled_at_idx";

-- DropIndex
DROP INDEX "vehicle_name_idx";

-- DropIndex
DROP INDEX "vehicle_maintenance_is_completed_idx";

-- CreateIndex
CREATE INDEX "job_order_department_id_idx" ON "job_order"("department_id");

-- CreateIndex
CREATE INDEX "job_order_division_id_idx" ON "job_order"("division_id");

-- CreateIndex
CREATE INDEX "mcrt_returned_by_id_idx" ON "mcrt"("returned_by_id");

-- CreateIndex
CREATE INDEX "mrv_withdrawn_by_id_idx" ON "mrv"("withdrawn_by_id");

-- CreateIndex
CREATE INDEX "mrv_exp_date_idx" ON "mrv"("exp_date");

-- CreateIndex
CREATE INDEX "mst_created_by_idx" ON "mst"("created_by");

-- CreateIndex
CREATE INDEX "osriv_exp_date_idx" ON "osriv"("exp_date");

-- CreateIndex
CREATE INDEX "project_item_item_id_idx" ON "project_item"("item_id");

-- CreateIndex
CREATE INDEX "purchase_order_fund_source_id_idx" ON "purchase_order"("fund_source_id");

-- CreateIndex
CREATE INDEX "receiving_report_received_by_id_idx" ON "receiving_report"("received_by_id");

-- CreateIndex
CREATE INDEX "seriv_request_type_idx" ON "seriv"("request_type");

-- CreateIndex
CREATE INDEX "seriv_exp_date_idx" ON "seriv"("exp_date");

-- CreateIndex
CREATE INDEX "spare_parts_request_vehicle_id_idx" ON "spare_parts_request"("vehicle_id");

-- CreateIndex
CREATE INDEX "supplier_created_by_idx" ON "supplier"("created_by");

-- CreateIndex
CREATE INDEX "trip_ticket_actual_start_time_actual_end_time_idx" ON "trip_ticket"("actual_start_time", "actual_end_time");

-- CreateIndex
CREATE INDEX "vehicle_maintenance_next_service_date_idx" ON "vehicle_maintenance"("next_service_date");
