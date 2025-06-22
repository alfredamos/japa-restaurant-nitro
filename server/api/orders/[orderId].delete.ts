import { deleteOrderByIdAction } from "~~/utils/actions/order.action";
import { ownerAndAdmin } from "~~/utils/ownerAndAdmin";

export default defineEventHandler(async (event) => {
  //----> Get order id from params.
  const orderId = getRouterParam(event, 'orderId');

   //----> Check for ownership or admin.
    await ownerAndAdmin(orderId)

  //----> Delete the order with given id from database.
  const response = await deleteOrderByIdAction(orderId);

  //----> Send back the response.
  return response;
})