import { Request, Response } from "express";
import { courtAvailabilityService } from "../services/courtAvailabilityService";

export class CourtAvailabilityController {
  async getCourtAvailability(req: Request, res: Response) {
    try {
      const courtId = parseInt(req.params.courtId);
      const court = await courtAvailabilityService.getCourtAvailability(
        courtId
      );
      res.json(court);
    } catch (error) {
      console.error("Error getting court availability:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateCourtAvailability(req: Request, res: Response) {
    try {
      const courtId = parseInt(req.params.courtId);
      const { isAvailable } = req.body;
      const court = await courtAvailabilityService.toggleCourtAvailability(
        courtId,
        isAvailable
      );
      res.json(court);
    } catch (error) {
      console.error("Error updating court availability:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async toggleAvailability(req: Request, res: Response): Promise<void> {
    try {
      const courtId = parseInt(req.params.courtId); // Convert to number
      const { isAvailable } = req.body;

      console.log(`Toggling court ${courtId} availability to ${isAvailable}`);

      const updatedCourt =
        await courtAvailabilityService.toggleCourtAvailability(
          courtId,
          isAvailable
        );

      res.json(updatedCourt);
    } catch (error: any) {
      console.error("Error toggling court availability:", error);
      res.status(500).json({
        error: "Failed to update court availability",
        details: error.message,
      });
    }
  }
}
