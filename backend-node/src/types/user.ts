export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: "PLAYER" | "TRAINER" | "ADMIN";
  gender: "M" | "F";
  firstName?: string;
  lastName?: string;
  menLevel?: string;
  womenLevel?: string;
  birthDate?: Date;
  phoneNumber?: string;
  city?: string;
  bio?: string;
  preferredHand?: "LEFT" | "RIGHT";
  yearsPlaying?: number;
}

export interface LoginDto {
  username: string;
  password: string;
}
