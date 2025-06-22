import { getOrderByIdAction } from "~~/utils/actions/order.action";
import { ownerAndAdmin } from "~~/utils/ownerAndAdmin";

export default defineEventHandler(async (event) => {
  //----> Get order id from params.
  const orderId = getRouterParam(event, 'orderId');

  //----> Check for ownership or admin.
  await ownerAndAdmin(orderId)

  //----> Get the order with given id.    
  const response = await getOrderByIdAction(orderId);

  //----> Send back the response.
  return response;
})