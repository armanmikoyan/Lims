-- CreateEnum
CREATE TYPE "Package" AS ENUM ('Bottle', 'SolventsBox', 'PackageBox');

-- AlterTable
ALTER TABLE "Reagent" ADD COLUMN     "package" "Package";
