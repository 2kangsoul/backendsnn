import { StatusCodes } from "http-status-codes";
import { validate } from "../../validate/validate";
import { OrderService } from "./order.service";
import { OrderValidation } from "./order.validation";
import { Request, Response } from "express";
export class OrderController {
  static async createOrder(req: Request, res: Response) {
    const { body } = validate(OrderValidation.CreateOrder, {
      body: req.body,
    });
    const userId = (req as any).user.id;
    const order = await OrderService.createOrder({body,userId})
    res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Order created successfuly",
        data: order
    })
  }
}
