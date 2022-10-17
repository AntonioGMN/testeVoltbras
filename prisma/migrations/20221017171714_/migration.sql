/*
  Warnings:

  - You are about to drop the `SuitablePlanet` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `planetId` to the `Stations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stations" ADD COLUMN     "planetId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL;

-- DropTable
DROP TABLE "SuitablePlanet";

-- CreateTable
CREATE TABLE "Planets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mass" DOUBLE PRECISION NOT NULL,
    "hasStation" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Planets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Stations" ADD CONSTRAINT "Stations_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "Planets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
