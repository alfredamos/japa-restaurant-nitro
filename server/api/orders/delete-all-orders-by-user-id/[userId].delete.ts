import { StatusCodes } from "http-status-codes";
import { deleteOrdersByUserIdAction } from "~~/utils/actions/order.action";
import { sameUserAndAdmin } from "~~/utils/sameUserAndAdmin";
import { useAuth } from "~~/utils/useAuth";

export default defineEventHandler(async (event) => {
  //----> Get the user-id from params.
  const userId = getRouterParam(event, 'userId');

  //----> Check for same user or admin.
  sameUserAndAdmin(userId)

  //----> Delete all orders associated with this user.
  const response = await deleteOrdersByUserIdAction(userId);

  //----> Send back the response.
  return response;
})