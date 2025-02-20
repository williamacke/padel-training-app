import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TrainerController {
  createSlot = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, start, end } = req.body;
      const trainerId = req.user.id; // Assuming you have user info in request

      const slot = await prisma.availabilitySlot.create({
        data: {
          id,
          start: new Date(start),
          end: new Date(end),
          trainerId,
        },
      });

      res.json(slot);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteSlot = async (req: Request, res: Response): Promise<void> => {
    try {
      const { slotId } = req.params;
      const trainerId = req.user.id;

      await prisma.availabilitySlot.deleteMany({
        where: {
          id: slotId,
          trainerId,
        },
      });

      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getSlots = async (req: Request, res: Response): Promise<void> => {
    try {
      const trainerId = req.user.id;

      const slots = await prisma.availabilitySlot.findMany({
        where: {
          trainerId,
        },
        orderBy: {
          start: "asc",
        },
      });

      res.json(slots);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
