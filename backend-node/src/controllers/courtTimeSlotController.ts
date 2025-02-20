import { Request, Response } from "express";
import { courtTimeSlotService } from "../services/courtTimeSlotService";

export class CourtTimeSlotController {
  async getCourtTimeSlot(req: Request, res: Response) {
    try {
      const courtId = parseInt(req.params.courtId);
      const timeSlot = await courtTimeSlotService.getCourtTimeSlot(courtId);
      res.json(timeSlot);
    } catch (error) {
      console.error("Error getting time slot:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async setCourtTimeSlot(req: Request, res: Response) {
    try {
      const courtId = parseInt(req.params.courtId);
      const { weekdayHighStart, weekendStart } = req.body;

      console.log("Received request to update time slot:", {
        courtId,
        weekdayHighStart,
        weekendStart,
      });

      const timeSlot = await courtTimeSlotService.setCourtTimeSlot(
        courtId,
        weekdayHighStart,
        weekendStart
      );

      res.json(timeSlot);
    } catch (error) {
      console.error("Error setting time slot:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllCourtTimeSlots(req: Request, res: Response) {
    try {
      const timeSlots = await courtTimeSlotService.getAllCourtTimeSlots();
      res.json(timeSlots);
    } catch (error) {
      console.error("Error getting all time slots:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
