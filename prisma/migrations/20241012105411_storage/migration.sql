/*
  Warnings:

  - A unique constraint covering the columns `[roomId,name]` on the table `Storage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Storage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `Storage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Storage" ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "roomId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Storage_roomId_name_key" ON "Storage"("roomId", "name");

-- AddForeignKey
ALTER TABLE "Storage" ADD CONSTRAINT "Storage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
