-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pending', 'Ordered', 'Fulfilled', 'Declined');

-- CreateTable
CREATE TABLE "ReagentRequest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "structureSmiles" TEXT,
    "structureImage" TEXT,
    "casNumber" TEXT,
    "desiredQuantity" TEXT NOT NULL,
    "userComments" TEXT,
    "procurementComments" TEXT,
    "status" "Status" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReagentRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReagentRequest" ADD CONSTRAINT "ReagentRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
