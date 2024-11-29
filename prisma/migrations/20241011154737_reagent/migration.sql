/*
  Warnings:

  - Added the required column `casNumber` to the `Reagent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `catalogId` to the `Reagent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `catalogLink` to the `Reagent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Reagent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expirationDate` to the `Reagent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Reagent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerUnit` to the `Reagent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `producer` to the `Reagent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityLeft` to the `Reagent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityUnit` to the `Reagent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalQuantity` to the `Reagent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reagent" ADD COLUMN     "casNumber" TEXT NOT NULL,
ADD COLUMN     "catalogId" TEXT NOT NULL,
ADD COLUMN     "catalogLink" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "expirationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "pricePerUnit" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "producer" TEXT NOT NULL,
ADD COLUMN     "quantityLeft" INTEGER NOT NULL,
ADD COLUMN     "quantityUnit" TEXT NOT NULL,
ADD COLUMN     "totalQuantity" TEXT NOT NULL;
