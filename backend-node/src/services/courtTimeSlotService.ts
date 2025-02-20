import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CourtTimeSlotService {
  async getCourtTimeSlot(courtId: number) {
    try {
      const timeSlot = await prisma.courtTimeSlot.findUnique({
        where: { courtId },
      });
      console.log(`Retrieved time slot for court ${courtId}:`, timeSlot);
      return timeSlot;
    } catch (error) {
      console.error(`Error getting time slot for court ${courtId}:`, error);
      throw error;
    }
  }

  async setCourtTimeSlot(
    courtId: number,
    weekdayHighStart: string, // e.g., "17:00" or "17:30"
    weekendStart: string // e.g., "08:30" or "09:00"
  ) {
    try {
      console.log(`Updating time slot for court ${courtId}:`, {
        weekdayHighStart,
        weekendStart,
      });
      const timeSlot = await prisma.courtTimeSlot.upsert({
        where: {
          courtId,
        },
        update: {
          weekdayHighStart,
          weekendStart,
        },
        create: {
          courtId,
          weekdayHighStart,
          weekendStart,
        },
      });
      console.log("Updated time slot:", timeSlot);
      return timeSlot;
    } catch (error) {
      console.error("Error updating time slot:", error);
      throw error;
    }
  }

  async getAllCourtTimeSlots() {
    try {
      const timeSlots = await prisma.courtTimeSlot.findMany();
      console.log("Retrieved all time slots:", timeSlots);
      return timeSlots;
    } catch (error) {
      console.error("Error getting all time slots:", error);
      throw error;
    }
  }

  isHighMoment(courtId: string, date: Date): boolean {
    // TODO: Implement logic to determine if given time is in high moment
    // 1. Get court time slot settings
    // 2. Check if weekend or weekday
    // 3. Compare with configured start times
    return false;
  }
}

export const courtTimeSlotService = new CourtTimeSlotService();
