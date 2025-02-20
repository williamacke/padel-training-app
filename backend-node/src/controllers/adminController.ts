import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AdminController {
  async getTrainers(req: Request, res: Response) {
    try {
      const trainers = await prisma.user.findMany({
        where: { role: "TRAINER" },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      });
      res.json(trainers);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      res.status(500).json({ error: "Failed to fetch trainers" });
    }
  }

  async getTrainerAvailability(req: Request, res: Response) {
    try {
      const { trainerId } = req.params;
      const availability = await prisma.availabilitySlot.findMany({
        where: { trainerId },
        orderBy: { start: "asc" },
      });
      res.json(availability);
    } catch (error) {
      console.error("Error fetching trainer availability:", error);
      res.status(500).json({ error: "Failed to fetch trainer availability" });
    }
  }
}
