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
// @ts-nocheck
const express_1 = require("express");
const whatsapp_1 = require("../../../config/whatsapp");
const verifyToken_1 = require("../../../Middleware/verifyToken");
const qrcode_1 = __importDefault(require("qrcode"));
const router = (0, express_1.Router)();
// ── GET /api/wa/status ─────────────────────────────────────────────────────
// Cek status koneksi WA + QR code sebagai base64 image
router.get("/status", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Paksa browser tidak cache response ini — status selalu real-time
        res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.set("Pragma", "no-cache");
        res.set("Expires", "0");
        const status = (0, whatsapp_1.getWAStatus)();
        let qrImage = null;
        if (status.qr) {
            // Convert QR string ke base64 PNG image
            qrImage = yield qrcode_1.default.toDataURL(status.qr, {
                width: 256,
                margin: 2,
                color: { dark: "#000000", light: "#ffffff" },
            });
        }
        return res.status(200).json({
            success: true,
            data: {
                isConnected: status.isConnected,
                status: status.status,
                hasQR: status.hasQR,
                qrImage, // base64 PNG, langsung bisa di-render di <img src="...">
            },
        });
    }
    catch (error) {
        console.error("Error WA status:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}));
// ── POST /api/wa/reset ─────────────────────────────────────────────────────
// Reset session WA (logout + hapus session files)
router.post("/reset", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, whatsapp_1.resetWASession)();
        // Reconnect setelah reset untuk generate QR baru
        setTimeout(() => (0, whatsapp_1.initWhatsApp)(), 1000);
        return res.status(200).json({
            success: true,
            message: "Session WA direset. QR baru akan muncul dalam beberapa detik.",
        });
    }
    catch (error) {
        console.error("Error WA reset:", error);
        return res
            .status(500)
            .json({ success: false, message: "Gagal reset session" });
    }
}));
exports.default = router;
//# sourceMappingURL=Whatsapp.Routers.js.map