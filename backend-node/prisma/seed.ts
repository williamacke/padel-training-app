import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("password", 10);
  await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
      gender: "M",
      firstName: "Admin",
      lastName: "User",
    },
  });

  // Create trainer user
  await prisma.user.create({
    data: {
      username: "trainer",
      email: "trainer@example.com",
      password: hashedPassword,
      role: "TRAINER",
      gender: "M",
      firstName: "John",
      lastName: "Doe",
      menLevel: "P500",
      yearsPlaying: 10,
    },
  });

  // Create player user
  await prisma.user.create({
    data: {
      username: "player",
      email: "player@example.com",
      password: hashedPassword,
      role: "PLAYER",
      gender: "F",
      firstName: "Jane",
      lastName: "Smith",
      womenLevel: "P300",
      yearsPlaying: 5,
    },
  });

  // Seed court time slots
  await prisma.courtTimeSlot.createMany({
    data: [
      {
        courtId: 5875540,
        weekdayHighStart: "17:30",
        weekendStart: "08:30",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courtId: 5875541,
        weekdayHighStart: "17:00",
        weekendStart: "09:00",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        courtId: 5875542,
        weekdayHighStart: "17:30",
        weekendStart: "08:30",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
