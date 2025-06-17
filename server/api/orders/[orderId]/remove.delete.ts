import { deleteOrderByIdAction } from "~~/utils/actions/order.action";

export default defineEventHandler(async (event) => {
  const orderId = getRouterParam(event, 'orderId');

  const response = await deleteOrderByIdAction(orderId);

  return response;
})