// import { CreateOrderInput } from "./order.validation";
// import { generateOrderNumber } from "../../helper/generatedOrderNumber";
// import prisma from "../../prisma";
// import { NotFoundError } from "../error/NotFound";
// import { BadRequestError } from "../error/BadRequest";
// export class OrderService {
// static async createOrder({ body, userId }: CreateOrderInput) {
//   const { items, note } = body;
//   return prisma.$transaction(async (tx) => {
//     let totalAmount = 0;
//     const orderItemData: { productId: string; quantity: number; price: number }[] = [];

//     for (const item of items) {
//       const product = await tx.product.findFirst({
//         where: { id: item.productId, deletedAt: null },
//       });
//       if (!product) throw new NotFoundError(`Product ${item.productId} is not available`);
//       if (product.stock < item.quantity)
//         throw new BadRequestError(`Stock ${product.name} is not enough, remaining ${product.stock}`);

//       totalAmount += product.price * item.quantity;
//       orderItemData.push({ productId: product.id, quantity: item.quantity, price: product.price });

//       await tx.product.update({
//         where: { id: product.id },
//         data: { stock: { decrement: item.quantity } },
//       });
//     }

//     // create order SETELAH semua item diproses
//     const order = await tx.order.create({
//       data: {
//         orderNumber: generateOrderNumber(),
//         userId,
//         totalAmount,
//         profitAmount: 0,
//         ...(note !== undefined && { note }),
//         items: { create: orderItemData },
//       },
//       include: { items: true }, // biar response ada detail item-nya, enak buat FE
//     });

//     return order;
//   });
// }
// }

import { CreateOrderInput } from "./order.validation";
import { generateOrderNumber } from "../../helper/generatedOrderNumber";
import prisma from "../../prisma";
import { NotFoundError } from "../error/NotFound";

export class OrderService {
  static async createOrder({ body, userId }: CreateOrderInput) {
    const { items, note } = body;

    return prisma.$transaction(async (tx) => {
      let totalAmount = 0;

      const orderItemData: {
        productId: string;
        quantity: number;
        price: number;
      }[] = [];

      for (const item of items) {
        const product = await tx.product.findFirst({
          where: {
            id: item.productId,
            deletedAt: null,
          },
        });

        if (!product) {
          throw new NotFoundError(
            `Product ${item.productId} is not available`
          );
        }

        // TODO:
        // Aktifkan kembali setelah Product.stock diubah menjadi Int.
        //
        // if (product.stock < item.quantity) {
        //   throw new BadRequestError(
        //     `Stock ${product.name} is not enough, remaining ${product.stock}`
        //   );
        // }

        totalAmount += (product.price ?? 0) * item.quantity;

        orderItemData.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price ?? 0,
        });

        // TODO:
        // Aktifkan kembali setelah Product.stock menjadi Int.
        //
        // await tx.product.update({
        //   where: {
        //     id: product.id,
        //   },
        //   data: {
        //     stock: {
        //       decrement: item.quantity,
        //     },
        //   },
        // });
      }

      const order = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          totalAmount,
          profitAmount: 0,
          ...(note !== undefined && { note }),
          items: {
            create: orderItemData,
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });
  }
}