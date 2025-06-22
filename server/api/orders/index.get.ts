import { getAllOrdersAction } from "~~/utils/actions/order.action";
import { getAndDeleteAllOrders } from "~~/utils/adminGetAndDeleteAllOrders";

export default defineEventHandler(async (event) => {
  //---> Check for admin privilege to delete all or get all.
  getAndDeleteAllOrders();

  //----> Get all orders.
  const response = await getAllOrdersAction();

  //----> Send back the response.
  return response;
});
