import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { validate } from "../../validate/validate";
import { OrderValidation } from "./order.validation";
import { OrderService } from "./order.services";

export class OrderController {
  static async createOrder(req: Request, res: Response) {
    const { body } = validate(OrderValidation.CreateOrder, {
      body: req.body,
    });
    const { sub: userId } = res.locals.payload;
    const order = await OrderService.createOrder({
      body,
      userId,
    });
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  }
  static async getOrders(req: Request, res: Response) {
    const orders = await OrderService.getOrders();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  }
  static async updateStatus(req: Request, res: Response) {
    const validated = validate(OrderValidation.UpdateOrderStatus, {
      params: req.params,
      body: req.body,
    });
    const order = await OrderService.updateStatus(validated);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  }
  static async deleteOrder(req: Request, res: Response) {
    const validated = validate(OrderValidation.DeleteOrder, {
      params: req.params,
    });
    const order = await OrderService.deleteOrder(validated);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Order deleted successfully",
      data: order,
    });
  }
}