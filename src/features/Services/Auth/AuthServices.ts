import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../../Repositories/Auth/AuthRepositories";
import { RegisterInput, LoginInput } from "../../Models/Auth/AuthModels";

const saltRounds = 10;

export const AuthService = {
  register: async (data: RegisterInput) => {
    const existingUser = await AuthRepository.findUserByEmailOrUsername(
      data.email,
      data.username,
    );
    if (existingUser) {
      throw new Error("Email atau username sudah terdaftar!");
    }

    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const newUser = await AuthRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    return newUser;
  },

  login: async (data: LoginInput) => {
    const user = await AuthRepository.findUserForLogin(data.emailOrUsername);
    if (!user) {
      throw new Error("Kredensial tidak valid!");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Kredensial tidak valid!");
    }

    return user;
  },

  findById: async (id: string) => {
    return await AuthRepository.findUserById(id);
  },
};