import { StatusCodes } from "http-status-codes";
import { deleteAllOrdersAction } from "~~/utils/actions/order.action";
import { useAuth } from "~~/utils/useAuth";

export default defineEventHandler(async (event) => {
  //----> Get the isAdmin flag.
  const {isUserAdmin} = useAuth();
  const isAdmin = isUserAdmin()
        //----> Check for same user and admin user.
        if (!isAdmin){
          sendError(
            event,
            createError({
              statusCode: StatusCodes.UNAUTHORIZED,
              statusMessage: "You are not authorized to delete these orders!",
            })
          );
        }

  //----> Delete all orders associated with this user.
  const response = await deleteAllOrdersAction();

  //----> Send back the response.
  return response;
})