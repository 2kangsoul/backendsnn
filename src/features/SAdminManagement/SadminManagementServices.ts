import { Role } from "@prisma/client";
import { NotFoundError } from "../../error/not-found-error";

import prisma from "../../prisma";
import {
  demoteAdminInput,
  promoteAdminInput,
} from "./SadminManagementValidation";
import { BadRequestError } from "../../error/bad.request";
import { transporter } from "../../config/mailer";
import { Forbidden } from "../../error/forbidden";
import { FRONTEND_URL } from "../../config/env.config";
import { compileTemplate } from "../../helper/email/compileHtmlTemplate";
export class AdminService {
  static async promote({ body }: promoteAdminInput) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!existingUser) throw new NotFoundError("User not found");
    if (existingUser.role !== Role.USER)
      throw new BadRequestError("User is already admin or superadmin");
    const updated = await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        role: Role.ADMIN,
      },
    });
    try {
      const html = compileTemplate("promote-admin", {
        fullName: updated.fullName,
        loginUrl: FRONTEND_URL,
      });
      await transporter.sendMail({
        to: updated.email,
        subject: "Your Account Has Been Promoted To Admin",
        html,
      });
    } catch (error) {
      console.log(error);
    }
    const { password, ...safePromote } = updated;
    return safePromote;
  }
  static async demote({ params }: demoteAdminInput) {
    const { userId } = params;
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!existingUser) throw new NotFoundError("User not found");
    if (existingUser.role === Role.SUPER_ADMIN)
      throw new Forbidden("super admin cannot be demoted");
    if (existingUser.role === Role.USER)
      throw new BadRequestError("User cannot be demoted");
    const demote = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: Role.USER,
      },
    });
    const { password, ...safeDemote } = demote;
    return safeDemote;
  }
  static async list() {
    const list = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.ADMIN, Role.SUPER_ADMIN],
        },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return list;
  }
}
