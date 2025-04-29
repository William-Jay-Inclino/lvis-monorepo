-- CreateIndex
CREATE INDEX "activity_category_id_idx" ON "activity"("category_id");

-- CreateIndex
CREATE INDEX "activity_category_cause_category_id_idx" ON "activity_category_cause"("category_id");

-- CreateIndex
CREATE INDEX "barangay_municipality_id_idx" ON "barangay"("municipality_id");

-- CreateIndex
CREATE INDEX "complaint_complaint_status_id_idx" ON "complaint"("complaint_status_id");

-- CreateIndex
CREATE INDEX "complaint_created_by_idx" ON "complaint"("created_by");

-- CreateIndex
CREATE INDEX "complaint_created_at_idx" ON "complaint"("created_at");

-- CreateIndex
CREATE INDEX "complaint_assigned_group_id_assigned_group_type_idx" ON "complaint"("assigned_group_id", "assigned_group_type");

-- CreateIndex
CREATE INDEX "complaint_detail_consumer_id_idx" ON "complaint_detail"("consumer_id");

-- CreateIndex
CREATE INDEX "complaint_detail_barangay_id_idx" ON "complaint_detail"("barangay_id");

-- CreateIndex
CREATE INDEX "complaint_log_complaint_id_idx" ON "complaint_log"("complaint_id");

-- CreateIndex
CREATE INDEX "complaint_log_created_by_idx" ON "complaint_log"("created_by");

-- CreateIndex
CREATE INDEX "complaint_log_created_at_idx" ON "complaint_log"("created_at");

-- CreateIndex
CREATE INDEX "lineman_area_id_idx" ON "lineman"("area_id");

-- CreateIndex
CREATE INDEX "lineman_supervisor_id_idx" ON "lineman"("supervisor_id");

-- CreateIndex
CREATE INDEX "lineman_created_at_idx" ON "lineman"("created_at");

-- CreateIndex
CREATE INDEX "lineman_schedule_lineman_id_idx" ON "lineman_schedule"("lineman_id");

-- CreateIndex
CREATE INDEX "lineman_schedule_log_lineman_id_idx" ON "lineman_schedule_log"("lineman_id");

-- CreateIndex
CREATE INDEX "lineman_schedule_log_recorded_by_idx" ON "lineman_schedule_log"("recorded_by");

-- CreateIndex
CREATE INDEX "lineman_schedule_log_recorded_at_idx" ON "lineman_schedule_log"("recorded_at");

-- CreateIndex
CREATE INDEX "municipality_area_id_idx" ON "municipality"("area_id");

-- CreateIndex
CREATE INDEX "sitio_barangay_id_idx" ON "sitio"("barangay_id");

-- CreateIndex
CREATE INDEX "task_assignee_id_idx" ON "task"("assignee_id");

-- CreateIndex
CREATE INDEX "task_task_status_id_idx" ON "task"("task_status_id");

-- CreateIndex
CREATE INDEX "task_activity_id_idx" ON "task"("activity_id");

-- CreateIndex
CREATE INDEX "task_acted_at_idx" ON "task"("acted_at");

-- CreateIndex
CREATE INDEX "task_created_at_idx" ON "task"("created_at");

-- CreateIndex
CREATE INDEX "task_created_by_idx" ON "task"("created_by");

-- CreateIndex
CREATE INDEX "task_assignment_area_id_idx" ON "task_assignment"("area_id");

-- CreateIndex
CREATE INDEX "task_assignment_department_id_idx" ON "task_assignment"("department_id");

-- CreateIndex
CREATE INDEX "task_assignment_division_id_idx" ON "task_assignment"("division_id");

-- CreateIndex
CREATE INDEX "task_assignment_created_at_idx" ON "task_assignment"("created_at");

-- CreateIndex
CREATE INDEX "task_assignment_created_by_idx" ON "task_assignment"("created_by");

-- CreateIndex
CREATE INDEX "task_detail_dles_task_id_idx" ON "task_detail_dles"("task_id");

-- CreateIndex
CREATE INDEX "task_detail_dles_barangay_id_idx" ON "task_detail_dles"("barangay_id");

-- CreateIndex
CREATE INDEX "task_detail_kwh_meter_task_id_idx" ON "task_detail_kwh_meter"("task_id");

-- CreateIndex
CREATE INDEX "task_detail_kwh_meter_barangay_id_idx" ON "task_detail_kwh_meter"("barangay_id");

-- CreateIndex
CREATE INDEX "task_detail_line_services_task_id_idx" ON "task_detail_line_services"("task_id");

-- CreateIndex
CREATE INDEX "task_detail_line_services_barangay_id_idx" ON "task_detail_line_services"("barangay_id");

-- CreateIndex
CREATE INDEX "task_detail_lmdga_task_id_idx" ON "task_detail_lmdga"("task_id");

-- CreateIndex
CREATE INDEX "task_detail_lmdga_barangay_id_idx" ON "task_detail_lmdga"("barangay_id");

-- CreateIndex
CREATE INDEX "task_detail_power_interruption_task_id_idx" ON "task_detail_power_interruption"("task_id");

-- CreateIndex
CREATE INDEX "task_detail_power_interruption_barangay_id_idx" ON "task_detail_power_interruption"("barangay_id");

-- CreateIndex
CREATE INDEX "task_file_task_id_idx" ON "task_file"("task_id");

-- CreateIndex
CREATE INDEX "task_log_task_id_idx" ON "task_log"("task_id");

-- CreateIndex
CREATE INDEX "task_log_created_by_idx" ON "task_log"("created_by");

-- CreateIndex
CREATE INDEX "task_log_created_at_idx" ON "task_log"("created_at");
