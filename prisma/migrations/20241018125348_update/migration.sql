-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "rdkit";

-- AlterTable
ALTER TABLE "Reagent" ADD COLUMN     "structure" TEXT;
