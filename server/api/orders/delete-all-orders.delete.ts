import { deleteAllOrdersAction } from "~~/utils/actions/order.action";

export default defineEventHandler(async (_event) => {

  const response = await deleteAllOrdersAction();

  return response;
})