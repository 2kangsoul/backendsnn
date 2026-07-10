import prisma from "../../../prisma";
import { RegisterInput } from "../../Models/Auth/AuthModels";

export const AuthRepository = {
  findUserByEmailOrUsername: async (email: string, username: string) => {
    return await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });
  },

  findUserForLogin: async (emailOrUsername: string) => {
    return await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });
  },

  createUser: async (userData: RegisterInput) => {
    return await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        fullName: userData.fullName,
        no_handphone: userData.no_handphone || "",
        country: userData.country || null,
        address: userData.address || null,
        role: "user",
      },
    });
  },

  // ← tambah ini
  findUserById: async (id: string) => {
    return await prisma.user.findUnique({
      where: { id },
    });
  },
};
