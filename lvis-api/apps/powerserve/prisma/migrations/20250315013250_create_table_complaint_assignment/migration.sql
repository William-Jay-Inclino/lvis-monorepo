-- CreateTable
CREATE TABLE "complaint_assignment" (
    "id" SERIAL NOT NULL,
    "complaint_id" INTEGER NOT NULL,
    "area_id" TEXT,
    "department_id" TEXT,
    "division_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "complaint_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "complaint_assignment_complaint_id_key" ON "complaint_assignment"("complaint_id");

-- AddForeignKey
ALTER TABLE "complaint_assignment" ADD CONSTRAINT "complaint_assignment_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaint_assignment" ADD CONSTRAINT "complaint_assignment_complaint_id_fkey" FOREIGN KEY ("complaint_id") REFERENCES "complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
