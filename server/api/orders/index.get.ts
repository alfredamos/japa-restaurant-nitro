import { getAllOrdersAction } from "~~/utils/actions/order.action";

export default defineEventHandler(async() => {
  const response = await getAllOrdersAction();

  return response;
})