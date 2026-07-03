"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const User_Controller_1 = require("../../Controller/Users/User.Controller");
exports.userRouter = (0, express_1.Router)();
const userController = new User_Controller_1.UserController(); // ✅ Tambahan baru
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads/profile_pictures";
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
        cb(null, uniqueName);
    },
});
const upload = (0, multer_1.default)({ storage });
// ENDPOINT: GET /api/users?role=admin&email=...
exports.userRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role, email } = req.query;
        const whereClause = {};
        if (role)
            whereClause.role = String(role);
        if (email)
            whereClause.email = String(email);
        const users = yield prisma_1.default.user.findMany({
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
    }
    catch (error) {
        console.error("Get users error:", error);
        return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
}));
// ENDPOINT: POST /api/users/upload
exports.userRouter.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res
            .status(400)
            .json({ success: false, message: "Tidak ada file yang diupload" });
    }
    const fileUrl = `http://localhost:8000/uploads/profile_pictures/${req.file.filename}`;
    return res.status(200).json({
        success: true,
        data: { fileUrl },
    });
});
// ✅ Tambahan baru
exports.userRouter.get("/monthly", userController.getMonthlyUsers);
// ENDPOINT: GET /api/users/:id
exports.userRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID tidak valid." });
        }
        const user = yield prisma_1.default.user.findUnique({
            where: { id: String(userId) },
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
    }
    catch (error) {
        console.error("Get user error:", error);
        return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
}));
// ENDPOINT: PUT /api/users/:id
exports.userRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawUserId = req.params.id;
        const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;
        if (!userId) {
            return res.status(400).json({ message: "User ID tidak valid." });
        }
        const { email, username, fullName, password, role, no_handphone, address, profilePic, adminDuration, country, } = req.body;
        const updateData = {};
        if (email !== undefined)
            updateData.email = email;
        if (username !== undefined)
            updateData.username = username;
        if (fullName !== undefined)
            updateData.fullName = fullName;
        if (role !== undefined)
            updateData.role = role;
        if (no_handphone !== undefined)
            updateData.no_handphone = no_handphone;
        if (address !== undefined)
            updateData.address = address;
        if (profilePic !== undefined)
            updateData.profilePic = profilePic;
        if (adminDuration !== undefined)
            updateData.adminDuration = adminDuration;
        if (country !== undefined)
            updateData.country = country;
        if (password && password.trim() !== "") {
            const saltRounds = 10;
            updateData.password = yield bcrypt_1.default.hash(password, saltRounds);
        }
        const updatedUser = yield prisma_1.default.user.update({
            where: { id: userId },
            data: updateData,
        });
        res
            .status(200)
            .json({ message: "Profile berhasil diupdate!", user: updatedUser });
    }
    catch (error) {
        console.error("Update profile error:", error);
        res
            .status(500)
            .json({ message: "Terjadi kesalahan saat mengupdate profil" });
    }
}));
// ENDPOINT: DELETE /api/users/:id
exports.userRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = String(req.params.id);
        if (!userId) {
            return res.status(400).json({ message: "User ID tidak valid." });
        }
        yield prisma_1.default.user.delete({
            where: { id: userId },
        });
        return res.status(200).json({ message: "User berhasil dihapus!" });
    }
    catch (error) {
        console.error("Delete user error:", error);
        return res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
}));
exports.default = exports.userRouter;
//# sourceMappingURL=User.Routes.js.map