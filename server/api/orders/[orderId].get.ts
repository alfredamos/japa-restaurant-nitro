import { StatusCodes } from "http-status-codes";
import { getOrderByIdAction } from "~~/utils/actions/order.action";
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
            statusMessage: "You are not authorized to view this order!",
          })
        );
      }

  //----> Get the order with given id.    
  const response = await getOrderByIdAction(orderId);

  //----> Send back the response.
  return response;
})