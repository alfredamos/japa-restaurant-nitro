import { deleteOrdersByUserIdAction } from "~~/utils/actions/order.action";

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId');

  const response = await deleteOrdersByUserIdAction(userId);

  return response;
})