import express, { Request, Response, RequestHandler } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { UserController } from "./controllers/userController";
import { TrainerController } from "./controllers/trainerController";
import { authMiddleware } from "./middleware/auth";
import { CourtController } from "./controllers/courtController";
import { PadelController } from "./controllers/padelController";
import { CourtAvailabilityController } from "./controllers/courtAvailabilityController";
import { CourtTimeSlotController } from "./controllers/courtTimeSlotController";
import { AdminController } from "./controllers/adminController";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const userController = new UserController();
const trainerController = new TrainerController();
const courtController = new CourtController();
const padelController = new PadelController();
const courtAvailabilityController = new CourtAvailabilityController();
const courtTimeSlotController = new CourtTimeSlotController();
const adminController = new AdminController();

// Configure CORS with specific options
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Auth routes
const loginHandler: RequestHandler = (req, res) =>
  userController.login(req, res);
const registerHandler: RequestHandler = (req, res) =>
  userController.register(req, res);

app.post("/api/auth/register", registerHandler);
app.post("/api/auth/login", loginHandler);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

const profileHandler: RequestHandler = (req, res) =>
  userController.getProfile(req, res);

app.get("/api/users/me", profileHandler);

app.put("/api/users/me", (req: Request, res: Response) =>
  userController.updateProfile(req, res)
);

app.get("/api/users", (req: Request, res: Response) =>
  userController.getAllUsers(req, res)
);
app.put("/api/users/:userId/role", (req: Request, res: Response) =>
  userController.updateUserRole(req, res)
);

// Add these routes with auth middleware
app.post(
  "/api/trainer/slots",
  authMiddleware as RequestHandler,
  (req: Request, res: Response) => trainerController.createSlot(req, res)
);
app.delete(
  "/api/trainer/slots/:slotId",
  authMiddleware as RequestHandler,
  (req: Request, res: Response) => trainerController.deleteSlot(req, res)
);

app.get("/api/trainer/slots", authMiddleware, (req: Request, res: Response) =>
  trainerController.getSlots(req, res)
);

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Define the courts endpoint
app.get("/api/courts/available", (req, res) => {
  return courtController.getAvailableCourts(req, res);
});

app.get("/api/courts/schedule", (req, res) => {
  return courtController.getDailySchedule(req, res);
});

// Add logging to padel endpoint
app.get("/api/padel/clubs", async (req, res) => {
  console.log("Received request for padel clubs");
  try {
    const clubs = await padelController.getClubs(req, res);
    console.log("Padel clubs response:", clubs);
    res.json(clubs);
  } catch (error) {
    console.error("Error in padel clubs endpoint:", error);
    res.status(500).json({ error: "Failed to fetch padel clubs" });
  }
});

app.put("/api/courts/:courtId/availability", (req, res) => {
  return courtAvailabilityController.toggleAvailability(req, res);
});

app.get("/api/courts/timeslots", (req, res) => {
  return courtTimeSlotController.getAllCourtTimeSlots(req, res);
});

app.get("/api/courts/:courtId/timeslot", (req, res) => {
  return courtTimeSlotController.getCourtTimeSlot(req, res);
});

app.put("/api/courts/:courtId/timeslot", (req, res) => {
  return courtTimeSlotController.setCourtTimeSlot(req, res);
});

// Admin routes
app.get("/api/admin/trainers", authMiddleware, (req, res) =>
  adminController.getTrainers(req, res)
);
app.get(
  "/api/admin/trainers/:trainerId/availability",
  authMiddleware,
  (req, res) => adminController.getTrainerAvailability(req, res)
);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
