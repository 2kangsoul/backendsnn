import { Request, Response } from "express";
import { SignUpService } from "../../Services/Signup/SignUp.Services";

export class SignUpController {
  private signUpService = new SignUpService();

  getNewSignUps = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.signUpService.getNewSignUpsData();
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getNewSignUps:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
}