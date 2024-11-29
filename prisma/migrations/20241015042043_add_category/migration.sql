/*
  Warnings:

  - Added the required column `category` to the `Reagent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Reagent', 'Sample');

-- AlterTable
ALTER TABLE "Reagent" ADD COLUMN     "category" "Category" NOT NULL;
