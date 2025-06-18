import { Order } from "@prisma/client";
import { editOrderByIdAction } from "~~/utils/actions/order.action";

export default defineEventHandler(async (event) => {
  const validatedBody = await readBody<Order>(event);

  const response = await editOrderByIdAction(validatedBody);

  return response;
})