import { StatusCodes } from "http-status-codes";
import { deleteOrdersByUserIdAction } from "~~/utils/actions/order.action";
import { useAuth } from "~~/utils/useAuth";

export default defineEventHandler(async (event) => {
  //----> Get same user and admin checker.
  const {sameUserAndAdmin} = useAuth()
  
  //----> Get the user-id from params.
  const userId = getRouterParam(event, 'userId');

  //----> Check for same user or admin.
  sameUserAndAdmin(userId)

  //----> Delete all orders associated with this user.
  const response = await deleteOrdersByUserIdAction(userId);

  //----> Check for existence of orders.
    if (!response) {
      throw sendError(
        event,
        createError({
          statusCode: StatusCodes.NOT_FOUND,
          message: "Orders are not available in the database!",
          stack: "Empty database!",
        })
      );
    }

  //----> Send back the response.
  return response;
})