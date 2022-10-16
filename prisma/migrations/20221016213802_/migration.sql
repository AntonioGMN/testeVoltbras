/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Stations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Stations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stations" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stations_name_key" ON "Stations"("name");
