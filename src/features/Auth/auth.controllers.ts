import { authValidation } from "./auth.validation";
import { validate } from "../../validate/validate";
import { AuthServices } from "./auth.services";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AUTH_COOKIE_NAME, authCookieOptions } from "../../config/cookieOptions";
export class AuthControllers {
  static async RegisterAccount(req: Request, res: Response) {
    const { body } = validate(authValidation.REGISTER_ACCOUNT, {
      body: req.body,
    });
    const safeRegister = await AuthServices.RegisterAccount({ body });
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Account Succes Created",
      data: safeRegister,
    });
  }
  static async LoginAccount(req: Request, res: Response) {
    const { body } = validate(authValidation.LOGIN_ACCOUNT, {
      body: req.body,
    });
    const { safeLogin, signToken } = await AuthServices.LoginAccount({ body });
    res.cookie(AUTH_COOKIE_NAME, signToken, authCookieOptions);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Successfuly Login",
      data:safeLogin,
    });
  }
  static async LogoutAccount(req: Request, res: Response) {
    await AuthServices.LogoutAccount();
    res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Logout successfuly",
    });
  }
  static async Me(req:Request,res:Response){
    const {sub: userId} = res.locals.payload
    const Me = await AuthServices.Me(userId)
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Success get curent user",
      data: Me
    })
  }
}
