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
exports.AuthRepository = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
exports.AuthRepository = {
    findUserByEmailOrUsername: (email, username) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma_1.default.user.findFirst({
            where: {
                OR: [{ email: email }, { username: username }],
            },
        });
    }),
    findUserForLogin: (emailOrUsername) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma_1.default.user.findFirst({
            where: {
                OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
            },
        });
    }),
    createUser: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma_1.default.user.create({
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
    }),
    // ← tambah ini
    findUserById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield prisma_1.default.user.findUnique({
            where: { id },
        });
    }),
};
//# sourceMappingURL=AuthRepositories.js.map