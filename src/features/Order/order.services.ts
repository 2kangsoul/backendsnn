import prisma from "../../prisma";
import { generateOrderNumber } from "../../helper/generatedOrder/generatedOrderNumber";
import { NotFoundError } from "../../error/not-found-error";
import { BadRequestError } from "../../error/bad.request";
import {
  CreateOrderInput,
  UpdateOrderStatusInput,
  DeleteOrderInput,
} from "./order.validation";

export class OrderService {
  static async createOrder({ body, userId }: CreateOrderInput) {
    const { productId, quantity, note } = body;
    const createdOrder = await prisma.$transaction(
      async (tx) => {
        const product = await tx.product.findUnique({
          where: { id: productId },
        });
        if (!product || product.deletedAt) {
          throw new NotFoundError("Product not found");
        }
        if (product.stock < quantity) {
          throw new BadRequestError(
            `Stock ${product.name} is not enough, remaining ${product.stock}`,
          );
        }
        const totalAmount = product.price * quantity;
        const order = await tx.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            userId,
            totalAmount,
            ...(note !== undefined && { note }),
            items: {
              create: {
                productId: product.id,
                quantity,
                price: product.price,
              },
            },
          },
        });
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: quantity } },
        });

        return order;
      },
      {
        timeout: 15000,
      },
    );
    return prisma.order.findUnique({
      where: { id: createdOrder.id },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, role: true },
        },
        items: {
          include: { product: true },
        },
      },
    });
  }

  static async getOrders() {
    return prisma.order.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        status: true,
        note: true,
        createdAt: true,
        user: {
          select: { id: true, fullName: true, email: true, role: true },
        },
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                name: true,
                brand: true,
                type: true,
                imageUrl: true,
                price: true,
                stock: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
  static async updateStatus({ params, body }: UpdateOrderStatusInput) {
    const order = await prisma.order.findFirst({
      where: { id: params.id, deletedAt: null },
    });
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    return prisma.order.update({
      where: { id: params.id },
      data: { status: body.status },
    });
  }
  static async deleteOrder({ params }: DeleteOrderInput) {
    const order = await prisma.order.findFirst({
      where: { id: params.id, deletedAt: null },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }
    return prisma.order.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });
  }
}
