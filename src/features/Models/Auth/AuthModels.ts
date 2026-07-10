import { JwtPayload } from "jsonwebtoken";

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  fullName: string;
  no_handphone?: string;
  country?: string; // ✅ Tambahan baru
  address?: string; // ✅ Tambahan baru
}

export interface LoginInput {
  emailOrUsername: string;
  password: string;
}

export interface AuthTokenPayload extends JwtPayload {
  id: string;
  email: string;
  username: string;
  role: string;
}