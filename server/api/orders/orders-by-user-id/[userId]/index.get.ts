import { getAllOrdersByUserIdAction } from "~~/utils/actions/order.action";

export default defineEventHandler(async(event) => {
  const userId = getRouterParam(event, 'userId');
  
  const response = await getAllOrdersByUserIdAction(userId);

  return response;
})