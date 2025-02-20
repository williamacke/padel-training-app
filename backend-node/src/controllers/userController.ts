import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { PrismaClient } from "@prisma/client";

const userService = new UserService();
const prisma = new PrismaClient();

export class UserController {
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.body.password) {
        res.status(400).json({ error: "Password is required" });
      } else {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
      } else {
        const result = await userService.login(username, password);
        res.json(result);
      }
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ error: "No token provided" });
      } else {
        const user = await userService.getUserProfile(token);
        res.json(user);
      }
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ error: "No token provided" });
        return;
      }

      const updatedUser = await userService.updateUser(token, req.body);
      res.json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          // Add other fields you want to include
        },
      });
      res.json(users);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  updateUserRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
        },
      });

      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
