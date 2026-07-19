import { ConflictError } from "../../error/conflict.error";
import prisma from "../../prisma";
import { jwtUtil } from "../../utils/jwtUtil";
import { LoginAccountInput, RegisterAccountInput } from "./auth.validation";
import { bcryptUtil } from "../../utils/bcryptUtil";
import { NotFoundError } from "../../error/not-found-error";
import { UnAuthorizedError } from "../../error/unauthorized";
import { transporter } from "../../config/mailer";
import { compileTemplate } from "../../helper/email/compileHtmlTemplate";
import { FRONTEND_URL } from "../../config/env.config";

export class AuthServices {
  static async RegisterAccount({ body }: RegisterAccountInput) {
    const existingAccount = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: body.email,
          },
          {
            username: body.username,
          },
          {
            no_handphone: body.contact,
          },
        ],
      },
    });
    if (existingAccount) {
      if (existingAccount.email === body.email)
        throw new ConflictError("Email already exist");
      if (existingAccount.username === body.username)
        throw new ConflictError("Username already exist");
      if (existingAccount.no_handphone === body.contact)
        throw new ConflictError("Phone number already exist");
    }
    const hashPassword = await bcryptUtil.hashPassword(body.password);
    const createAccount = await prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        fullName: body.fullName,
        password: hashPassword,
        no_handphone: body.contact,
      },
    });
    try {
      const html = compileTemplate("register-welcome", {
        fullName: createAccount.fullName,
        loginUrl: FRONTEND_URL,
      });
      await transporter.sendMail({
        to: createAccount.email,
        subject: "Registrasi Berhasil - SNN Fragrance",
        html,
      });
    } catch (error) {
      console.log(error);
    }

    const { password, device, adminDuration, deletedAt, ...safeRegister } =
      createAccount;
    return {
      safeRegister,
    };
  }
  static async LoginAccount({ body }: LoginAccountInput) {
    const existingAccount = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!existingAccount)
      throw new NotFoundError("Email or Password not found");
    const comparePassword = await bcryptUtil.comparePassword(
      body.password,
      existingAccount.password,
    );
    if (!comparePassword)
      throw new UnAuthorizedError("Email or Password not found");
    const signToken = await jwtUtil.signToken({
      sub: existingAccount.id,
      role: existingAccount.role,
    });
    const { password, device, adminDuration, deletedAt, ...safeLogin } =
      existingAccount;
    return {
      safeLogin,
      signToken,
    };
  }
  static async LogoutAccount() {
    return;
  }
  static async Me(userId: string) {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
        deletedAt: null,
      },
    });
    if (!existingUser) throw new NotFoundError("User Not Found");
    const { password, device, adminDuration, deletedAt, ...userSafe } =
      existingUser;
    return userSafe;
  }
}
