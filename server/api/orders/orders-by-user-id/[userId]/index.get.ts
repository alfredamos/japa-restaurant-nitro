import { StatusCodes } from "http-status-codes";
import { getAllOrdersByUserIdAction } from "~~/utils/actions/order.action";
import { useAuth } from "~~/utils/useAuth";

export default defineEventHandler(async(event) => {
  //----> Get the user-id from param.
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
          statusMessage: "You are authorized to view these orders!",
        })
      );
    }

  //----> Get orders associated with thi user.
  const response = await getAllOrdersByUserIdAction(userId);

  //----> Send back the response.
  return response;
})