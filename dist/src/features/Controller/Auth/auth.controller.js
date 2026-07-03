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
exports.getMe = exports.login = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const AuthServices_1 = require("../../Services/Auth/AuthServices");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Fungsi untuk register
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        if (!body.email || !body.username || !body.password || !body.fullName) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ message: "Semua data wajib diisi!" });
        }
        const newUser = yield AuthServices_1.AuthService.register(body);
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
            message: "Register berhasil!",
            data: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                fullName: newUser.fullName,
            },
        });
    }
    catch (error) {
        if (error.message === "Email atau username sudah terdaftar!") {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ message: error.message });
        }
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Terjadi kesalahan pada server" });
    }
});
exports.register = register;
// Fungsi untuk login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        if (!body.emailOrUsername || !body.password) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ message: "Email/Username dan Password wajib diisi!" });
        }
        const user = yield AuthServices_1.AuthService.login(body);
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Login berhasil!",
            token: token,
            data: {
                id: user.id,
                email: user.email,
                username: user.username,
                fullName: user.fullName,
                role: user.role,
                no_handphone: user.no_handphone || "",
                address: user.address || "",
                profilePic: user.profilePic || "",
            },
        });
    }
    catch (error) {
        if (error.message === "Kredensial tidak valid!") {
            return res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .json({ message: error.message });
        }
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Terjadi kesalahan pada server" });
    }
});
exports.login = login;
// FUNGSI BARU: Mengambil data user yang sedang login
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // userId didapat dari middleware authenticateToken
        const userId = req.user.id;
        // Memanggil service untuk mencari user berdasarkan ID
        const user = yield AuthServices_1.AuthService.findById(userId);
        if (!user) {
            return res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ message: "User tidak ditemukan" });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            data: {
                id: user.id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                role: user.role,
                no_handphone: user.no_handphone || "",
                address: user.address || "",
                profilePic: user.profilePic || "",
                country: user.country || "",
            },
        });
    }
    catch (error) {
        return res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Terjadi kesalahan pada server saat mengambil profil" });
    }
});
exports.getMe = getMe;
//# sourceMappingURL=auth.controller.js.map