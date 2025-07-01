import { StatusCodes } from "http-status-codes";
import { getAllOrdersByUserIdAction } from "~~/utils/actions/order.action";
import { useAuth } from "~~/utils/useAuth";

export default defineEventHandler(async (event) => {
  //----> Get same user and admin checker
  const {sameUserAndAdmin} = useAuth()
  
  //----> Get the user-id from param.
  const userId = getRouterParam(event, "userId");

  //----> Check for same user or admin.
  sameUserAndAdmin(userId);

  //----> Get orders associated with thi user.
  const response = await getAllOrdersByUserIdAction(userId);

  //----> Send back the response.
  return response;
});
