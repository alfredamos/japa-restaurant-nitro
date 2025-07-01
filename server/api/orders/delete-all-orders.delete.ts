import { StatusCodes } from "http-status-codes";
import { deleteAllOrdersAction } from "~~/utils/actions/order.action";
import { getAndDeleteAllOrders } from "~~/utils/adminGetAndDeleteAllOrders";

export default defineEventHandler(async (event) => {
  //---> Check for admin privilege to delete all or get all.
  getAndDeleteAllOrders();

  //----> Delete all orders associated with this user.
  const response = await deleteAllOrdersAction();

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