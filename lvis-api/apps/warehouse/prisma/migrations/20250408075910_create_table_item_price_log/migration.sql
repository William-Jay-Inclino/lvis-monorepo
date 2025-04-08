-- CreateTable
CREATE TABLE "item_price_log" (
    "id" SERIAL NOT NULL,
    "item_id" UUID NOT NULL,
    "total_quantity" INTEGER NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_price_log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "item_price_log" ADD CONSTRAINT "item_price_log_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
