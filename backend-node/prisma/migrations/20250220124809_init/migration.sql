/*
  Warnings:

  - You are about to drop the column `highMomentStart` on the `CourtTimeSlot` table. All the data in the column will be lost.
  - Added the required column `weekdayHighStart` to the `CourtTimeSlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weekendStart` to the `CourtTimeSlot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourtTimeSlot" DROP COLUMN "highMomentStart",
ADD COLUMN     "weekdayHighStart" TEXT NOT NULL,
ADD COLUMN     "weekendStart" TEXT NOT NULL;
