"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token)
        return res
            .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
            .json({ message: "Token tidak tersedia!" });
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }
    catch (error) {
        return res
            .status(http_status_codes_1.StatusCodes.FORBIDDEN)
            .json({ message: "Token tidak valid!" });
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=verifyToken.js.map