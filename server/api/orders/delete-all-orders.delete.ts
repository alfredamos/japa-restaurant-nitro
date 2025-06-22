import { deleteAllOrdersAction } from "~~/utils/actions/order.action";
import { getAndDeleteAllOrders } from "~~/utils/adminGetAndDeleteAllOrders";

export default defineEventHandler(async (_event) => {
  //---> Check for admin privilege to delete all or get all.
  getAndDeleteAllOrders();

  //----> Delete all orders associated with this user.
  const response = await deleteAllOrdersAction();

  //----> Send back the response.
  return response;
})