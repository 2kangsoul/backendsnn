// @ts-nocheck
import { Router, Request, Response } from "express";
import {
  getWAStatus,
  resetWASession,
  initWhatsApp,
} from "../../../config/whatsapp";
import { verifyToken } from "../../../Middleware/verifyToken";
import QRCode from "qrcode";

const router = Router();

// ── GET /api/wa/status ─────────────────────────────────────────────────────
// Cek status koneksi WA + QR code sebagai base64 image
router.get(
  "/status",
  verifyToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      // Paksa browser tidak cache response ini — status selalu real-time
      res.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");

      const status = getWAStatus();

      let qrImage: string | null = null;
      if (status.qr) {
        // Convert QR string ke base64 PNG image
        qrImage = await QRCode.toDataURL(status.qr, {
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
    } catch (error) {
      console.error("Error WA status:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
);

// ── POST /api/wa/reset ─────────────────────────────────────────────────────
// Reset session WA (logout + hapus session files)
router.post(
  "/reset",
  verifyToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      await resetWASession();
      // Reconnect setelah reset untuk generate QR baru
      setTimeout(() => initWhatsApp(), 1000);
      return res.status(200).json({
        success: true,
        message:
          "Session WA direset. QR baru akan muncul dalam beberapa detik.",
      });
    } catch (error) {
      console.error("Error WA reset:", error);
      return res
        .status(500)
        .json({ success: false, message: "Gagal reset session" });
    }
  },
);

export default router;
