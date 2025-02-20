import { Request, Response } from "express";
import { TennisVlaanderenService } from "../services/tennisVlaanderenService";
import { CourtService } from "../services/courtService";

const tennisService = new TennisVlaanderenService(
  process.env.TENNIS_VLAANDEREN_CLIENT_ID || "",
  process.env.TENNIS_VLAANDEREN_CLIENT_SECRET || ""
);

const courtService = new CourtService(
  tennisService,
  process.env.TENNIS_VLAANDEREN_CLUB_NUMBER || "",
  process.env.TENNIS_VLAANDEREN_RESERVATION_KEY || ""
);

interface Court {
  court_id: string;
  court: string; // e.g., "Indoor 1", "Padel 1 - Overdekt"
  sport: string; // "Tennis" or "Padel"
  in_outdoor: string; // "I" for Indoor, "O" for Outdoor
}

interface Reservation {
  reservation_id: number;
  start_time: string; // format: "DD/MM/YYYY HH:mm"
  end_time: string; // format: "DD/MM/YYYY HH:mm"
  duration: number; // in minutes
  reservation_type: string; // "V" for fixed, "N" for normal, "A" for activity
  reservation_info: string | null;
  players: Player[];
  access_code: string | null;
}

interface Player {
  member_id: number;
  member_nr: string | null;
  first_name: string;
  last_name: string;
  head: string; // "J" for yes, "N" for no
  guest: string; // "J" for yes, "N" for no
  added: string; // "J" for yes, "N" for no
}

export class CourtController {
  async getDailySchedule(req: Request, res: Response): Promise<void> {
    try {
      console.log("Getting daily schedule...");
      const day = req.query.day as string | undefined;
      const schedule = await courtService.getDailySchedule(day);
      res.json(schedule);
    } catch (error: any) {
      console.error("Error in getDailySchedule:", error);
      res.status(500).json({
        error: "Failed to fetch daily schedule",
        details: error.message,
      });
    }
  }

  async getAvailableCourts(req: Request, res: Response): Promise<void> {
    try {
      console.log("Getting available courts...");
      const courts = await courtService.getAvailableCourts();
      res.json(courts);
    } catch (error: any) {
      console.error("Error in getAvailableCourts:", error);
      res.status(500).json({
        error: "Failed to fetch available courts",
        details: error.message,
      });
    }
  }

  async testConnection(req: Request, res: Response): Promise<void> {
    try {
      console.log("Testing Tennis Vlaanderen connection...");
      console.log(
        "Using club number:",
        process.env.TENNIS_VLAANDEREN_CLUB_NUMBER
      );

      const schedule = await tennisService.getDailySchedule(
        process.env.TENNIS_VLAANDEREN_CLUB_NUMBER || "",
        process.env.TENNIS_VLAANDEREN_RESERVATION_KEY || ""
      );

      console.log("Response received:", schedule);
      res.json({
        success: true,
        data: schedule,
      });
    } catch (error: any) {
      console.error("Test connection failed:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        details: error.response?.data || "No additional details",
      });
    }
  }
}
