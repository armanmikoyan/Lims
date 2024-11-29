-- AlterTable
ALTER TABLE "ReagentRequest" ADD COLUMN     "catalogId" TEXT,
ADD COLUMN     "catalogLink" TEXT,
ADD COLUMN     "expirationDate" TIMESTAMP(3),
ADD COLUMN     "pricePerUnit" DOUBLE PRECISION,
ADD COLUMN     "producer" TEXT;
