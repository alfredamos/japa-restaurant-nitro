import { deleteOrderByIdAction } from "~~/utils/actions/order.action";
import { useAuth } from "~~/utils/useAuth";

export default defineEventHandler(async (event) => {
  //----> Get owner and admin checker.
  const {ownerAndAdmin} = useAuth()
  
  //----> Get order id from params.
  const orderId = getRouterParam(event, 'orderId');

  //----> Check for ownership or admin.
  await ownerAndAdmin(orderId)

  //----> Delete the order with given id from database.
  const response = await deleteOrderByIdAction(orderId);

  //----> Send back the response.
  return response;
})