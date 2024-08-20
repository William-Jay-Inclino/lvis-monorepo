-- CreateTable
CREATE TABLE "item_location" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "station_id" TEXT NOT NULL,
    "quantity_on_hand" INTEGER NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "item_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_movement" (
    "id" TEXT NOT NULL,
    "origin_id" TEXT NOT NULL,
    "destination_id" TEXT NOT NULL,
    "quantity_moved" INTEGER NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "item_movement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "station" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "deleted_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "station_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "item_location" ADD CONSTRAINT "item_location_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_location" ADD CONSTRAINT "item_location_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_movement" ADD CONSTRAINT "item_movement_origin_id_fkey" FOREIGN KEY ("origin_id") REFERENCES "item_location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_movement" ADD CONSTRAINT "item_movement_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "item_location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
