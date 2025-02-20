import { Request, Response } from "express";

interface Court {
  id: number;
  name: string;
  isIndoor: boolean;
}

interface Club {
  id: number;
  name: string;
  courts: Court[];
}

export class PadelController {
  async getClubs(req: Request, res: Response): Promise<void> {
    try {
      // Mock data representing your single club with multiple courts
      const club: Club = {
        id: 1,
        name: "TC Gym",
        courts: [
          { id: 1, name: "Padel 1 - Overdekt", isIndoor: true },
          { id: 2, name: "Padel 2 - Overdekt", isIndoor: true },
          { id: 3, name: "Padel 3 - Outdoor", isIndoor: false },
          { id: 4, name: "Padel 4 - Outdoor", isIndoor: false },
        ],
      };

      res.json([club]); // Keeping array structure for consistency
    } catch (error: any) {
      console.error("Error in getClubs:", error);
      res.status(500).json({
        error: "Failed to fetch padel clubs",
        details: error.message,
      });
    }
  }
}
