import { z } from "zod";

export class OrderValidation {
  static readonly CreateOrder = z.object({
    body: z.object({
      productId: z.string().uuid("Invalid product id"),
      quantity: z.coerce
        .number()
        .int()
        .positive("Quantity must be at least 1"),

      note: z.string().max(500).optional(),
    }),
  });
  static readonly UpdateOrderStatus = z.object({
    params: z.object({
      id: z.string().uuid("Invalid order id"),
    }),

    body: z.object({
      status: z.enum([
        "PENDING",
        "PROCESSING",
        "DELIVERED",
        "PAID",
        "REJECTED",
        "REFUNDED",
      ]),
    }),
  });

  static readonly DeleteOrder = z.object({
    params: z.object({
      id: z.string().uuid("Invalid order id"),
    }),
  });
}
export type CreateOrderInput =
  z.infer<typeof OrderValidation.CreateOrder> & {
    userId: string;
  };

export type UpdateOrderStatusInput =
  z.infer<typeof OrderValidation.UpdateOrderStatus>;

export type DeleteOrderInput =
  z.infer<typeof OrderValidation.DeleteOrder>;