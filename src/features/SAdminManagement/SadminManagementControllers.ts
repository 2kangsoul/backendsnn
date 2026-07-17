import { Request, Response } from "express";
import { validate } from "../../validate/validate";
import { AdminService } from "./SadminManagementServices";
import { StatusCodes } from "http-status-codes";
import { AdminValidation } from "./SadminManagementValidation";
export class AdminController {
  static async promote(req: Request, res: Response) {
    const { body } = validate(AdminValidation.promoteAdminSchema, {
      body: req.body,
    });
    const result = await AdminService.promote({ body });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "User promoted to admin",
      data: result,
    });
  }
  static async demote(req: Request, res: Response) {
    const { params } = validate(AdminValidation.demoteAdminSchmea, {
      params: req.params,
    });
    const result = await AdminService.demote({ params });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Admin demote to user",
      data: result,
    });
  }
  static async list(req: Request, res: Response) {
    const result = await AdminService.list();
    res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    });
  }
}
