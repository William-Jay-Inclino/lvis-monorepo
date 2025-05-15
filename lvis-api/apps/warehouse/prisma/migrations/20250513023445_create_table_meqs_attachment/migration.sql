-- AlterTable
ALTER TABLE "material_equipment_quotation_summary" ADD COLUMN     "meqs_notes" TEXT;

-- CreateTable
CREATE TABLE "meqs_attachment" (
    "id" TEXT NOT NULL,
    "meqs_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL DEFAULT 'no_filename',
    "src" TEXT NOT NULL,

    CONSTRAINT "meqs_attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "meqs_attachment_meqs_id_idx" ON "meqs_attachment"("meqs_id");

-- AddForeignKey
ALTER TABLE "meqs_attachment" ADD CONSTRAINT "meqs_attachment_meqs_id_fkey" FOREIGN KEY ("meqs_id") REFERENCES "material_equipment_quotation_summary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
