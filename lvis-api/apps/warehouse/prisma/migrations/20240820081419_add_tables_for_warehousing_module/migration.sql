-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "deleted_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "osriv" (
    "id" TEXT NOT NULL,
    "osriv_number" TEXT NOT NULL,
    "date_requested" TIMESTAMP(3) NOT NULL,
    "purpose" TEXT NOT NULL,
    "requested_by_id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "item_from_id" TEXT NOT NULL,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "osriv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "osriv_approver" (
    "id" TEXT NOT NULL,
    "osriv_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMP(3),
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "osriv_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "osriv_item" (
    "id" TEXT NOT NULL,
    "osriv_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "osriv_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seriv" (
    "id" TEXT NOT NULL,
    "seriv_number" TEXT NOT NULL,
    "date_requested" TIMESTAMP(3) NOT NULL,
    "purpose" TEXT NOT NULL,
    "requested_by_id" TEXT NOT NULL,
    "request_type" TEXT NOT NULL,
    "mwo_number" TEXT,
    "jo_number" TEXT,
    "consumer_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "item_from_id" TEXT NOT NULL,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "seriv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seriv_approver" (
    "id" TEXT NOT NULL,
    "seriv_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMP(3),
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "seriv_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seriv_item" (
    "id" TEXT NOT NULL,
    "seriv_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "seriv_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mrv" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "mrv_number" TEXT NOT NULL,
    "date_requested" TIMESTAMP(3) NOT NULL,
    "purpose" TEXT NOT NULL,
    "requested_by_id" TEXT NOT NULL,
    "request_type" TEXT NOT NULL,
    "or_number" TEXT,
    "jo_number" TEXT,
    "cwo_number" TEXT,
    "consumer_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "item_from_id" TEXT NOT NULL,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "mrv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mrv_approver" (
    "id" TEXT NOT NULL,
    "mrv_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMP(3),
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "mrv_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mrv_item" (
    "id" TEXT NOT NULL,
    "mrv_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "mrv_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mct" (
    "id" TEXT NOT NULL,
    "mrv_id" TEXT NOT NULL,
    "mct_number" TEXT NOT NULL,
    "mct_date" TIMESTAMP(3) NOT NULL,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "mct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mct_approver" (
    "id" TEXT NOT NULL,
    "mct_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMP(3),
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "mct_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mcrt" (
    "id" TEXT NOT NULL,
    "mct_id" TEXT NOT NULL,
    "mcrt_number" TEXT NOT NULL,
    "mcrt_date" TIMESTAMP(3) NOT NULL,
    "prepared_by_id" TEXT NOT NULL,
    "returned_by_id" TEXT NOT NULL,
    "received_by_id" TEXT NOT NULL,
    "wo_number" TEXT,
    "mo_number" TEXT,
    "jo_number" TEXT,
    "note" TEXT NOT NULL,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "mcrt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mcrt_approver" (
    "id" TEXT NOT NULL,
    "mcrt_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMP(3),
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "mcrt_approver_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "osriv_osriv_number_key" ON "osriv"("osriv_number");

-- CreateIndex
CREATE INDEX "osriv_date_requested_idx" ON "osriv"("date_requested");

-- CreateIndex
CREATE INDEX "osriv_approver_osriv_id_idx" ON "osriv_approver"("osriv_id");

-- CreateIndex
CREATE INDEX "osriv_item_osriv_id_item_id_idx" ON "osriv_item"("osriv_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "seriv_seriv_number_key" ON "seriv"("seriv_number");

-- CreateIndex
CREATE INDEX "seriv_date_requested_idx" ON "seriv"("date_requested");

-- CreateIndex
CREATE INDEX "seriv_approver_seriv_id_idx" ON "seriv_approver"("seriv_id");

-- CreateIndex
CREATE INDEX "seriv_item_seriv_id_item_id_idx" ON "seriv_item"("seriv_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "mrv_mrv_number_key" ON "mrv"("mrv_number");

-- CreateIndex
CREATE INDEX "mrv_date_requested_idx" ON "mrv"("date_requested");

-- CreateIndex
CREATE INDEX "mrv_approver_mrv_id_idx" ON "mrv_approver"("mrv_id");

-- CreateIndex
CREATE INDEX "mrv_item_mrv_id_item_id_idx" ON "mrv_item"("mrv_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "mct_mct_number_key" ON "mct"("mct_number");

-- CreateIndex
CREATE INDEX "mct_mrv_id_mct_date_idx" ON "mct"("mrv_id", "mct_date");

-- CreateIndex
CREATE INDEX "mct_approver_mct_id_idx" ON "mct_approver"("mct_id");

-- CreateIndex
CREATE UNIQUE INDEX "mcrt_mcrt_number_key" ON "mcrt"("mcrt_number");

-- CreateIndex
CREATE INDEX "mcrt_mct_id_mcrt_date_idx" ON "mcrt"("mct_id", "mcrt_date");

-- CreateIndex
CREATE INDEX "mcrt_approver_mcrt_id_idx" ON "mcrt_approver"("mcrt_id");

-- AddForeignKey
ALTER TABLE "osriv" ADD CONSTRAINT "osriv_item_from_id_fkey" FOREIGN KEY ("item_from_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osriv_approver" ADD CONSTRAINT "osriv_approver_osriv_id_fkey" FOREIGN KEY ("osriv_id") REFERENCES "osriv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osriv_item" ADD CONSTRAINT "osriv_item_osriv_id_fkey" FOREIGN KEY ("osriv_id") REFERENCES "osriv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "osriv_item" ADD CONSTRAINT "osriv_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seriv" ADD CONSTRAINT "seriv_item_from_id_fkey" FOREIGN KEY ("item_from_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seriv_approver" ADD CONSTRAINT "seriv_approver_seriv_id_fkey" FOREIGN KEY ("seriv_id") REFERENCES "seriv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seriv_item" ADD CONSTRAINT "seriv_item_seriv_id_fkey" FOREIGN KEY ("seriv_id") REFERENCES "seriv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seriv_item" ADD CONSTRAINT "seriv_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mrv" ADD CONSTRAINT "mrv_item_from_id_fkey" FOREIGN KEY ("item_from_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "mcrt_approver" ADD CONSTRAINT "mcrt_approver_mcrt_id_fkey" FOREIGN KEY ("mcrt_id") REFERENCES "mcrt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
