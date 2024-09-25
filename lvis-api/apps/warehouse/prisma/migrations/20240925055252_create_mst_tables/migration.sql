-- CreateTable
CREATE TABLE "mst" (
    "id" TEXT NOT NULL,
    "mst_number" TEXT NOT NULL,
    "mst_date" TIMESTAMP(3) NOT NULL,
    "returned_by_id" TEXT NOT NULL,
    "cwo_number" TEXT,
    "mwo_number" TEXT,
    "jo_number" TEXT,
    "remarks" TEXT NOT NULL,
    "cancelled_by" TEXT,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "cancelled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "mst_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mst_approver" (
    "id" TEXT NOT NULL,
    "mst_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "date_approval" TIMESTAMP(3),
    "notes" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "label_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "mst_approver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mst_item" (
    "id" TEXT NOT NULL,
    "mst_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metadata" JSONB,

    CONSTRAINT "mst_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mst_mst_number_key" ON "mst"("mst_number");

-- CreateIndex
CREATE INDEX "mst_mst_date_idx" ON "mst"("mst_date");

-- CreateIndex
CREATE INDEX "mst_approver_mst_id_idx" ON "mst_approver"("mst_id");

-- CreateIndex
CREATE INDEX "mst_item_mst_id_item_id_idx" ON "mst_item"("mst_id", "item_id");

-- AddForeignKey
ALTER TABLE "mst_approver" ADD CONSTRAINT "mst_approver_mst_id_fkey" FOREIGN KEY ("mst_id") REFERENCES "mst"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mst_item" ADD CONSTRAINT "mst_item_mst_id_fkey" FOREIGN KEY ("mst_id") REFERENCES "mst"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mst_item" ADD CONSTRAINT "mst_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
