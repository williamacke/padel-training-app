import { PrismaClient } from "@prisma/client";
import { courtAvailabilityService } from "./courtAvailabilityService";
import { TennisVlaanderenService } from "./tennisVlaanderenService";

const prisma = new PrismaClient();

interface TennisCourt {
  court_id: number;
  court: string;
  sport: string;
  in_outdoor: string;
  reservations: any[];
  isAvailableForLessons?: boolean;
}

interface DbCourt {
  id: number;
  courtId: number;
  isAvailableForLessons: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Reservation {
  reservation_id: number;
  start_time: string;
  end_time: string;
  duration: number;
  reservation_type: string;
  reservation_info: string | null;
  players: Player[];
  access_code: string | null;
}

interface Player {
  member_id: number;
  member_nr: string | null;
  first_name: string;
  last_name: string;
  head: string;
  guest: string;
  added: string;
}

export class CourtService {
  private tennisService: TennisVlaanderenService;
  private clubNumber: string;
  private reservationKey: string;
  private courtsCache: { items: TennisCourt[] } | null = null;

  constructor(
    tennisService: TennisVlaanderenService,
    clubNumber: string,
    reservationKey: string
  ) {
    this.tennisService = tennisService;
    this.clubNumber = clubNumber;
    this.reservationKey = reservationKey;
  }

  async getAvailableCourts() {
    try {
      const tvCourts = await this.tennisService.getAvailableCourts(
        this.clubNumber,
        this.reservationKey
      );

      const dbCourts = await courtAvailabilityService.getAllCourts();

      const mergedCourts = {
        ...tvCourts,
        items: tvCourts.items.map((court: TennisCourt) => {
          const dbCourt = dbCourts.find(
            (dc: DbCourt) => dc.courtId === court.court_id
          );
          return {
            ...court,
            isAvailableForLessons: dbCourt?.isAvailableForLessons ?? false,
          };
        }),
      };

      return mergedCourts;
    } catch (error) {
      console.error("Error getting available courts:", error);
      throw error;
    }
  }

  async getDailySchedule(day?: string) {
    const response = await this.tennisService.getDailySchedule(
      this.clubNumber,
      this.reservationKey,
      day
    );
    return response;
  }

  async getTennisCourts() {
    const courts = await this.getAvailableCourts();
    return courts.items.filter(
      (court: TennisCourt) => court.sport === "Tennis"
    );
  }

  async getPadelCourts() {
    const courts = await this.getAvailableCourts();
    return courts.items.filter((court: TennisCourt) => court.sport === "Padel");
  }

  async getIndoorCourts() {
    const courts = await this.getAvailableCourts();
    return courts.items.filter(
      (court: TennisCourt) => court.in_outdoor === "I"
    );
  }

  async getOutdoorCourts() {
    const courts = await this.getAvailableCourts();
    return courts.items.filter(
      (court: TennisCourt) => court.in_outdoor === "O"
    );
  }

  private processSchedule(courts: TennisCourt[]): TennisCourt[] {
    if (!Array.isArray(courts)) {
      console.log("Invalid courts data:", courts);
      return [];
    }

    return courts.map((court: TennisCourt) => ({
      court_id: court.court_id,
      court: court.court,
      sport: court.sport,
      in_outdoor: court.in_outdoor,
      reservations: court.reservations || [],
      isAvailableForLessons: court.isAvailableForLessons || false,
    }));
  }

  getAvailableTimeSlots(court: TennisCourt, reservations: Reservation[]) {
    // TODO: Implement logic to find available time slots between reservations
    // This will depend on your business rules (opening hours, slot duration, etc.)
  }

  clearCache() {
    console.log("Clearing courts cache");
    this.courtsCache = null;
  }

  private async findDbCourt(court: TennisCourt): Promise<DbCourt | null> {
    const dbCourts = await prisma.court.findMany();
    return (
      dbCourts.find((dc: DbCourt) => dc.courtId === Number(court.court_id)) ||
      null
    );
  }
}
