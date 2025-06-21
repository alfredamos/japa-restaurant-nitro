import { Order } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { editOrderByIdAction } from "~~/utils/actions/order.action";
import { useAuth } from "~~/utils/useAuth";

export default defineEventHandler(async (event) => {
  const validatedBody = await readBody<Order>(event);

  //----> Get ownership and is-admin flags.
        const {checkForOwnershipAndAdmin} = useAuth();
        const {isAdmin, isOwner} = await checkForOwnershipAndAdmin(validatedBody?.id);
      
        //----> Check for same user and admin user.
        if (!isAdmin && !isOwner){
          sendError(
            event,
            createError({
              statusCode: StatusCodes.UNAUTHORIZED,
              statusMessage: "You are authorized to edit this order.!",
            })
          );
        }

  //----> Edit the given order.
  const response = await editOrderByIdAction(validatedBody);

  //----> Send back the response.
  return response;
})