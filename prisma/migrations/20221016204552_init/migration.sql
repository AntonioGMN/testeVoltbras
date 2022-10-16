-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stations" (
    "id" SERIAL NOT NULL,
    "planet" TEXT NOT NULL,

    CONSTRAINT "Stations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recharges" (
    "id" SERIAL NOT NULL,
    "start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end" TIMESTAMP(3) NOT NULL,
    "stationId" INTEGER NOT NULL,

    CONSTRAINT "Recharges_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recharges" ADD CONSTRAINT "Recharges_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Stations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
