-- CreateTable
CREATE TABLE "SuitablePlanet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mass" DOUBLE PRECISION NOT NULL,
    "hasStation" BOOLEAN NOT NULL,

    CONSTRAINT "SuitablePlanet_pkey" PRIMARY KEY ("id")
);
