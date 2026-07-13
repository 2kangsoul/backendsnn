import { z } from "zod";
export class OrderValidation {
  static readonly CreateOrder = z.object({
    body: z.object({
      items: z
        .array(
          z.object({
            productId: z.string().uuid("Invalid product id"),
            quantity: z.coerce
              .number()
              .int()
              .positive("Quantity must be at least 1"),
          }),
        )
        .min(1, "Order must contain at least 1 item"),
      note: z.string().max(500).optional(),
    }),
  });
  static readonly GetOrderById = z.object({
    params: z.object({
      id: z.string().uuid("invalid order id"),
    }),
  });
}
export type CreateOrderInput = z.infer<typeof OrderValidation.CreateOrder> & {
  userId: string;
};
export type GetOrderByIdInput = z.infer<typeof OrderValidation.GetOrderById> & {
  userId: string
}
