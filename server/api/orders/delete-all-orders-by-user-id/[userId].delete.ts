import { StatusCodes } from "http-status-codes";
import { deleteOrdersByUserIdAction } from "~~/utils/actions/order.action";
import { useAuth } from "~~/utils/useAuth";

export default defineEventHandler(async (event) => {
  //----> Get the user-id from params.
  const userId = getRouterParam(event, 'userId');

  //----> Get same user and is-admin flags.
  const {checkForSameUserAndAdmin} = useAuth();
  const {isAdmin, isSameUser} = checkForSameUserAndAdmin(userId)

  //----> Check for same user and admin user.
  if (!isAdmin && !isSameUser){
    sendError(
      event,
      createError({
        statusCode: StatusCodes.UNAUTHORIZED,
        statusMessage: "You are not authorized to delete these orders!",
      })
    );
  }

  //----> Delete all orders associated with this user.
  const response = await deleteOrdersByUserIdAction(userId);

  //----> Send back the response.
  return response;
})