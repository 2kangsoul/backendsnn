import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "../../Services/Auth/AuthServices";
import { RegisterInput, LoginInput } from "../../Models/Auth/AuthModels";
import jwt from "jsonwebtoken";
import { verifyToken } from "../../../Middleware/verifyToken";

// Fungsi untuk register
export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const body: RegisterInput = req.body;

    if (!body.email || !body.username || !body.password || !body.fullName) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Semua data wajib diisi!" });
    }

    const newUser = await AuthService.register(body);

    return res.status(StatusCodes.CREATED).json({
      message: "Register berhasil!",
      data: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        fullName: newUser.fullName,
      },
    });
  } catch (error: any) {
    if (error.message === "Email atau username sudah terdaftar!") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.message });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Terjadi kesalahan pada server" });
  }
};

// Fungsi untuk login
export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const body: LoginInput = req.body;

    if (!body.emailOrUsername || !body.password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email/Username dan Password wajib diisi!" });
    }

    const user = await AuthService.login(body);

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: (user as any).role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );

    return res.status(StatusCodes.OK).json({
      message: "Login berhasil!",
      token: token,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: (user as any).role,
        no_handphone: (user as any).no_handphone || "",
        address: (user as any).address || "",
        profilePic: (user as any).profilePic || "",
      },
    });
  } catch (error: any) {
    if (error.message === "Kredensial tidak valid!") {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: error.message });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Terjadi kesalahan pada server" });
  }
};

// FUNGSI BARU: Mengambil data user yang sedang login
export const getMe = async (req: any, res: Response): Promise<any> => {
  try {
    // userId didapat dari middleware authenticateToken
    const userId = req.user.id;

    // Memanggil service untuk mencari user berdasarkan ID
    const user = await AuthService.findById(userId);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User tidak ditemukan" });
    }

    return res.status(StatusCodes.OK).json({
      data: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: (user as any).role,
        no_handphone: (user as any).no_handphone || "",
        address: (user as any).address || "",
        profilePic: (user as any).profilePic || "",
        country: (user as any).country || "",
      },
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Terjadi kesalahan pada server saat mengambil profil" });
  }
};
