import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Court {
  court_id: number;
  court: string;
  sport: string;
  in_outdoor: string;
}

export class CourtAvailabilityService {
  async getAvailableCourts() {
    try {
      const courts = await prisma.court.findMany({
        where: {
          isAvailableForLessons: true,
        },
      });
      return courts;
    } catch (error) {
      throw error;
    }
  }

  async getAllCourts() {
    try {
      const courts = await prisma.court.findMany();
      return courts;
    } catch (error) {
      console.error("Error getting courts:", error);
      throw error;
    }
  }

  async getCourtAvailability(courtId: number) {
    try {
      const court = await prisma.court.findUnique({
        where: {
          courtId: courtId,
        },
      });
      return court;
    } catch (error) {
      console.error("Error getting court availability:", error);
      throw error;
    }
  }

  async createCourt(courtId: number) {
    try {
      const court = await prisma.court.create({
        data: {
          courtId: courtId,
          isAvailableForLessons: false,
        },
      });
      return court;
    } catch (error) {
      console.error("Error creating court:", error);
      throw error;
    }
  }

  async updateCourtAvailability(court: Court, isAvailable: boolean) {
    try {
      const existingCourt = await prisma.court.findUnique({
        where: { courtId: court.court_id },
      });

      if (!existingCourt) {
        return await prisma.court.create({
          data: {
            courtId: court.court_id,
            isAvailableForLessons: isAvailable,
          },
        });
      }

      return await prisma.court.update({
        where: { courtId: court.court_id },
        data: { isAvailableForLessons: isAvailable },
      });
    } catch (error) {
      console.error("Error updating court availability:", error);
      throw error;
    }
  }

  async toggleCourtAvailability(courtId: number, isAvailable: boolean) {
    try {
      return await prisma.court.upsert({
        where: {
          courtId: courtId,
        },
        update: {
          isAvailableForLessons: isAvailable,
        },
        create: {
          courtId: courtId,
          isAvailableForLessons: isAvailable,
        },
      });
    } catch (error) {
      console.error("Error toggling court availability:", error);
      throw error;
    }
  }

  async syncCourts(courts: { court_id: number }[]) {
    // Sync courts from Tennis Vlaanderen with our database
    const operations = courts.map((court) =>
      prisma.court.upsert({
        where: { courtId: court.court_id },
        update: {}, // Keep existing availability
        create: {
          courtId: court.court_id,
          isAvailableForLessons: false,
        },
      })
    );

    await prisma.$transaction(operations);
  }
}

export const courtAvailabilityService = new CourtAvailabilityService();
