-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PLAYER', 'TRAINER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "MenLevel" AS ENUM ('P100', 'P200', 'P300', 'P400', 'P500', 'P700', 'P1000');

-- CreateEnum
CREATE TYPE "WomenLevel" AS ENUM ('P50', 'P100', 'P200', 'P300', 'P500', 'P700');

-- CreateEnum
CREATE TYPE "Hand" AS ENUM ('LEFT', 'RIGHT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PLAYER',
    "gender" "Gender" NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "menLevel" "MenLevel",
    "womenLevel" "WomenLevel",
    "bio" TEXT,
    "birthDate" TIMESTAMP(3),
    "city" TEXT,
    "phoneNumber" TEXT,
    "preferredHand" "Hand",
    "yearsPlaying" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "availability_slots" (
    "id" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "trainerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availability_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Court" (
    "id" SERIAL NOT NULL,
    "courtId" INTEGER NOT NULL,
    "isAvailableForLessons" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Court_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourtTimeSlot" (
    "id" SERIAL NOT NULL,
    "courtId" INTEGER NOT NULL,
    "highMomentStart" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourtTimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Court_courtId_key" ON "Court"("courtId");

-- CreateIndex
CREATE UNIQUE INDEX "CourtTimeSlot_courtId_key" ON "CourtTimeSlot"("courtId");

-- AddForeignKey
ALTER TABLE "availability_slots" ADD CONSTRAINT "availability_slots_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
