import { Request, Response } from "express";
import { UserService } from "../../Services/User/User.Services";

export class UserController {
  private userService = new UserService();

  getMonthlyUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.userService.getMonthlyUsersData();
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getMonthlyUsers:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
}