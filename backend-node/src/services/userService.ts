import {
  PrismaClient,
  Prisma,
  Role,
  Gender,
  MenLevel,
  WomenLevel,
  Hand,
} from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export class UserService {
  async createUser(data: any) {
    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: data.email }, { username: data.username }],
        },
      });

      if (existingUser) {
        if (existingUser.email === data.email) {
          throw new Error("Email already in use");
        }
        if (existingUser.username === data.username) {
          throw new Error("Username already in use");
        }
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: hashedPassword,
          role: data.role as Role,
          gender: data.gender as Gender,
          firstName: data.firstName || null,
          lastName: data.lastName || null,
          menLevel: data.gender === "M" && data.menLevel ? data.menLevel : null,
          womenLevel:
            data.gender === "F" && data.womenLevel ? data.womenLevel : null,
          birthDate: data.birthDate ? new Date(data.birthDate) : null,
          city: data.city || null,
          phoneNumber: data.phoneNumber || null,
          preferredHand: data.preferredHand || null,
          yearsPlaying: data.yearsPlaying ? parseInt(data.yearsPlaying) : null,
          bio: data.bio || null,
        },
      });

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          const field = (error.meta?.target as string[])[0];
          throw new Error(`${field} already in use`);
        }
      }
      throw error;
    }
  }

  async login(username: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Invalid password");
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getUserProfile(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as { userId: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  async updateUser(token: string, data: any) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as { userId: string };

      const user = await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          menLevel: data.gender === "M" ? data.menLevel : null,
          womenLevel: data.gender === "F" ? data.womenLevel : null,
          phoneNumber: data.phoneNumber,
          city: data.city,
          bio: data.bio,
          preferredHand: data.preferredHand,
          yearsPlaying: data.yearsPlaying ? parseInt(data.yearsPlaying) : null,
        },
      });

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}
