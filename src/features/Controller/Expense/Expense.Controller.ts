import { Request, Response } from "express";
import { ExpenseService } from "../../Services/Expense/Expense.Services";

export class ExpenseController {
  private expenseService = new ExpenseService();

  getChartData = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.expenseService.getChartData();
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getChartData:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  createExpense = async (req: Request, res: Response): Promise<void> => {
    try {
      const { amount, description, userId } = req.body;
      const data = await this.expenseService.createExpense({
        amount: parseFloat(amount),
        description,
        userId,
      });
      res.status(201).json({ success: true, data });
    } catch (error) {
      console.error("Error createExpense:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
}