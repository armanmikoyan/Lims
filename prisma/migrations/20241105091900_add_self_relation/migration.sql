-- AlterTable
ALTER TABLE "Reagent" ALTER COLUMN "casNumber" DROP NOT NULL,
ALTER COLUMN "catalogId" DROP NOT NULL,
ALTER COLUMN "catalogLink" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "pricePerUnit" DROP NOT NULL,
ALTER COLUMN "producer" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_Prepared" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Prepared_AB_unique" ON "_Prepared"("A", "B");

-- CreateIndex
CREATE INDEX "_Prepared_B_index" ON "_Prepared"("B");

-- AddForeignKey
ALTER TABLE "_Prepared" ADD CONSTRAINT "_Prepared_A_fkey" FOREIGN KEY ("A") REFERENCES "Reagent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Prepared" ADD CONSTRAINT "_Prepared_B_fkey" FOREIGN KEY ("B") REFERENCES "Reagent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
