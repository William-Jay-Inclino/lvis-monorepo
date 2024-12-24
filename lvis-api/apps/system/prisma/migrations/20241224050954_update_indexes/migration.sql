-- DropIndex
DROP INDEX "employee_firstname_lastname_idx";

-- CreateIndex
CREATE INDEX "account_deleted_at_idx" ON "account"("deleted_at");

-- CreateIndex
CREATE INDEX "classification_deleted_at_idx" ON "classification"("deleted_at");

-- CreateIndex
CREATE INDEX "division_department_id_idx" ON "division"("department_id");

-- CreateIndex
CREATE INDEX "employee_lastname_idx" ON "employee"("lastname");

-- CreateIndex
CREATE INDEX "employee_firstname_idx" ON "employee"("firstname");

-- CreateIndex
CREATE INDEX "employee_middlename_idx" ON "employee"("middlename");

-- CreateIndex
CREATE INDEX "employee_rank_number_idx" ON "employee"("rank_number");

-- CreateIndex
CREATE INDEX "employee_department_id_idx" ON "employee"("department_id");

-- CreateIndex
CREATE INDEX "employee_division_id_idx" ON "employee"("division_id");

-- CreateIndex
CREATE INDEX "employee_status_idx" ON "employee"("status");

-- CreateIndex
CREATE INDEX "user_lastname_idx" ON "user"("lastname");

-- CreateIndex
CREATE INDEX "user_firstname_idx" ON "user"("firstname");

-- CreateIndex
CREATE INDEX "user_middlename_idx" ON "user"("middlename");

-- CreateIndex
CREATE INDEX "user_status_idx" ON "user"("status");

-- CreateIndex
CREATE INDEX "user_employee_employee_id_idx" ON "user_employee"("employee_id");

-- CreateIndex
CREATE INDEX "user_employee_user_id_idx" ON "user_employee"("user_id");
