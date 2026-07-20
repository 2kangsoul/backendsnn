import prisma from "../../../prisma";
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { UserController } from "../../Controller/Users/User.Controller";
import upload from "../../../Middleware/uploadMiddleware";
import { uploadCloudinary } from "../../../helper/cloudinary/cloudinary";

export const userRouter = Router();
const userController = new UserController(); // ✅ Tambahan baru



// ENDPOINT: GET /api/users?role=admin&email=...
userRouter.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { role, email } = req.query;

    const whereClause: any = { deletedAt: null };
    if (role) whereClause.role = String(role);
    if (email) whereClause.email = String(email);

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: true,
        no_handphone: true,
        address: true,
        profilePic: true,
        createdAt: true,
      },
    });

    return res.status(200).json({ data: users });
  } catch (error: any) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// ENDPOINT: POST /api/users/upload
userRouter.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response): Promise<any> => {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Tidak ada file yang diupload" });
    }
    // ponytail: reuse uploadCloudinary, folder profile_pictures
    const result = await uploadCloudinary(req.file.buffer, "profile_pictures");
    return res.status(200).json({
      success: true,
      data: { fileUrl: result.secure_url },
    });
  },
);

// ✅ Tambahan baru
userRouter.get("/monthly", userController.getMonthlyUsers);

// ENDPOINT: GET /api/users/:id
userRouter.get("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID tidak valid." });
    }

    const user = await prisma.user.findFirst({
      where: { id: String(userId), deletedAt: null },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        role: true,
        no_handphone: true,
        address: true,
        profilePic: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Get user error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

// ENDPOINT: PUT /api/users/:id
userRouter.put("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const rawUserId = req.params.id;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

    if (!userId) {
      return res.status(400).json({ message: "User ID tidak valid." });
    }

    const {
      email,
      username,
      fullName,
      password,
      role,
      no_handphone,
      address,
      profilePic,
      adminDuration,
      country,
    } = req.body;

    const updateData: any = {};
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;
    if (fullName !== undefined) updateData.fullName = fullName;

    if (role !== undefined) updateData.role = role;
    if (no_handphone !== undefined) updateData.no_handphone = no_handphone;
    if (address !== undefined) updateData.address = address;
    if (profilePic !== undefined) updateData.profilePic = profilePic;
    if (adminDuration !== undefined) updateData.adminDuration = adminDuration;
    if (country !== undefined) updateData.country = country;

    if (password && password.trim() !== "") {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res
      .status(200)
      .json({ message: "Profile berhasil diupdate!", user: updatedUser });
  } catch (error: any) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mengupdate profil" });
  }
});

// ENDPOINT: DELETE /api/users/:id
userRouter.delete("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = String(req.params.id);

    if (!userId) {
      return res.status(400).json({ message: "User ID tidak valid." });
    }

    // ponytail: soft-delete (PRD 5.3) — isi deletedAt, jangan hard delete.
    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });

    return res.status(200).json({ message: "User berhasil dihapus!" });
  } catch (error: any) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

export default userRouter;
