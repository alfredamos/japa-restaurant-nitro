import { Order } from "@prisma/client";
import { OrderPayload } from "~~/models/orders/orderPayload.model";
import { orderCreateAction } from "~~/utils/actions/order.action";

export default defineEventHandler(async (event) => {
  const validatedBody = await readBody<OrderPayload>(event);

  const response = await orderCreateAction(validatedBody);

  return response;
})