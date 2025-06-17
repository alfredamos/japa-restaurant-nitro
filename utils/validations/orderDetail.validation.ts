import { z } from "zod";

export const orderDetailSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  menuItemId: z.string(),
  image: z.string().optional(),
  orderId: z.string().optional(),
});
