import { StatusCodes } from "http-status-codes";
import { deleteOrderByIdAction } from "~~/utils/actions/order.action";
import { useAuth } from "~~/utils/useAuth";

export default defineEventHandler(async (event) => {
  //----> Get order id from params.
  const orderId = getRouterParam(event, 'orderId');

  //----> Get ownership and is-admin flags.
        const {checkForOwnershipAndAdmin} = useAuth();
        const {isAdmin, isOwner} = await checkForOwnershipAndAdmin(orderId);
      
        //----> Check for same user and admin user.
        if (!isAdmin && !isOwner){
          sendError(
            event,
            createError({
              statusCode: StatusCodes.UNAUTHORIZED,
              statusMessage: "You are authorized to delete this order!",
            })
          );
        }

  //----> Delete the order with given id from database.
  const response = await deleteOrderByIdAction(orderId);

  //----> Send back the response.
  return response;
})