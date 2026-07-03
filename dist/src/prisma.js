"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable wajib di-set!");
}
const prisma = (_a = globalThis.__prisma) !== null && _a !== void 0 ? _a : new client_1.PrismaClient();
if (process.env.NODE_ENV !== "production") {
    globalThis.__prisma = prisma;
}
exports.default = prisma;
//# sourceMappingURL=prisma.js.map