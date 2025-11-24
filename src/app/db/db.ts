import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export const initiateUser = async () => {
  const payload = {
    firstName: "First",
    lastName: "User",
    email: "user@gmail.com" as string,
    photo: null,
    password: await bcrypt.hash("12345678", 10),
  };
  const existUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (existUser) {
    return;
  }
  await prisma.user.create({ data: payload });
  console.log("user created");
};
