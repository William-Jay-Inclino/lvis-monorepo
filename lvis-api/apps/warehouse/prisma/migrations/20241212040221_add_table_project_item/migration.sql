-- CreateTable
CREATE TABLE "project_item" (
    "id" SERIAL NOT NULL,
    "project_id" TEXT NOT NULL,
    "item_id" TEXT,

    CONSTRAINT "project_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_item_item_id_key" ON "project_item"("item_id");

-- CreateIndex
CREATE INDEX "project_item_project_id_idx" ON "project_item"("project_id");

-- AddForeignKey
ALTER TABLE "project_item" ADD CONSTRAINT "project_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_item" ADD CONSTRAINT "project_item_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
