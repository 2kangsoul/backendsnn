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
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const AuthRepositories_1 = require("../../Repositories/Auth/AuthRepositories");
const saltRounds = 10;
exports.AuthService = {
    register: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield AuthRepositories_1.AuthRepository.findUserByEmailOrUsername(data.email, data.username);
        if (existingUser) {
            throw new Error("Email atau username sudah terdaftar!");
        }
        const hashedPassword = yield bcrypt_1.default.hash(data.password, saltRounds);
        const newUser = yield AuthRepositories_1.AuthRepository.createUser(Object.assign(Object.assign({}, data), { password: hashedPassword }));
        return newUser;
    }),
    login: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield AuthRepositories_1.AuthRepository.findUserForLogin(data.emailOrUsername);
        if (!user) {
            throw new Error("Kredensial tidak valid!");
        }
        const isPasswordValid = yield bcrypt_1.default.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Kredensial tidak valid!");
        }
        return user;
    }),
    // ← tambah ini
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield AuthRepositories_1.AuthRepository.findUserById(id);
    }),
};
//# sourceMappingURL=AuthServices.js.map