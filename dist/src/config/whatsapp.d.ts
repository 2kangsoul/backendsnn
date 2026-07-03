import { WASocket } from "@whiskeysockets/baileys";
export declare function getWASocket(): WASocket | null;
export declare function isWAConnected(): boolean;
export declare function getWAStatus(): {
    isConnected: boolean;
    status: "disconnected" | "connecting" | "connected";
    hasQR: boolean;
    qr: string | null;
};
export declare function onWAMessage(handler: (msg: any) => void): void;
export declare function resetWASession(): Promise<void>;
export declare function initWhatsApp(): Promise<void>;
export declare function sendWAMessage(phone: string, text: string, retries?: number): Promise<boolean>;
//# sourceMappingURL=whatsapp.d.ts.map