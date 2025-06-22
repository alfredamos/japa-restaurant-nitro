import { StatusCodes } from "http-status-codes";
import { useAuth } from "./useAuth";

export async function ownerAndAdmin(orderId: string) {
  const { checkForOwnershipAndAdmin } = useAuth();
  console.log("In ownerAndAdmin-middleware, orderId : ", orderId);
  //----> Run the middleware only when order-id is not null.
  if (!!orderId) {
    const { isAdmin, isOwner } = await checkForOwnershipAndAdmin(orderId);
    console.log({ isAdmin, isOwner });
    //----> Check for ownership and admin user.
    if (!isAdmin && !isOwner) {
      throw createError({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: "You are not authorized on this page!",
        statusMessage: "Not Authorized",
        stack: undefined
      });
    }
  }
}
