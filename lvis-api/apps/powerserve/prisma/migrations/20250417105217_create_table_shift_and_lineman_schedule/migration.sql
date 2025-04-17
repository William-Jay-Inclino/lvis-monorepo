-- CreateTable
CREATE TABLE "lineman_schedule" (
    "id" TEXT NOT NULL,
    "lineman_id" TEXT NOT NULL,
    "mon_shift_id" INTEGER NOT NULL,
    "tue_shift_id" INTEGER NOT NULL,
    "wed_shift_id" INTEGER NOT NULL,
    "thu_shift_id" INTEGER NOT NULL,
    "fri_shift_id" INTEGER NOT NULL,
    "sat_shift_id" INTEGER NOT NULL,
    "sun_shift_id" INTEGER NOT NULL,

    CONSTRAINT "lineman_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shift" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "start_time" TIMESTAMPTZ NOT NULL,
    "end_time" TIMESTAMPTZ NOT NULL,
    "is_day_off" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "shift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lineman_schedule_lineman_id_key" ON "lineman_schedule"("lineman_id");

-- CreateIndex
CREATE UNIQUE INDEX "shift_name_key" ON "shift"("name");

-- AddForeignKey
ALTER TABLE "lineman_schedule" ADD CONSTRAINT "lineman_schedule_mon_shift_id_fkey" FOREIGN KEY ("mon_shift_id") REFERENCES "shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineman_schedule" ADD CONSTRAINT "lineman_schedule_tue_shift_id_fkey" FOREIGN KEY ("tue_shift_id") REFERENCES "shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineman_schedule" ADD CONSTRAINT "lineman_schedule_wed_shift_id_fkey" FOREIGN KEY ("wed_shift_id") REFERENCES "shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineman_schedule" ADD CONSTRAINT "lineman_schedule_thu_shift_id_fkey" FOREIGN KEY ("thu_shift_id") REFERENCES "shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineman_schedule" ADD CONSTRAINT "lineman_schedule_fri_shift_id_fkey" FOREIGN KEY ("fri_shift_id") REFERENCES "shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineman_schedule" ADD CONSTRAINT "lineman_schedule_sat_shift_id_fkey" FOREIGN KEY ("sat_shift_id") REFERENCES "shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineman_schedule" ADD CONSTRAINT "lineman_schedule_sun_shift_id_fkey" FOREIGN KEY ("sun_shift_id") REFERENCES "shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineman_schedule" ADD CONSTRAINT "lineman_schedule_lineman_id_fkey" FOREIGN KEY ("lineman_id") REFERENCES "lineman"("id") ON DELETE CASCADE ON UPDATE CASCADE;
