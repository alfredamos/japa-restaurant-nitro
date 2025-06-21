import { StatusCodes } from "http-status-codes";
import { getAllOrdersAction } from "~~/utils/actions/order.action";
import { useAuth } from "~~/utils/useAuth";

export default defineEventHandler(async(event) => {
  //----> Get the isAdmin flag.
    const {isUserAdmin} = useAuth();
    const isAdmin = isUserAdmin()
          //----> Check for same user and admin user.
          if (!isAdmin){
            sendError(
              event,
              createError({
                statusCode: StatusCodes.UNAUTHORIZED,
                statusMessage: "You are authorized to view these orders!",
              })
            );
          }
  
  //----> Get all orders.
  const response = await getAllOrdersAction();

  //----> Send back the response.
  return response;
})