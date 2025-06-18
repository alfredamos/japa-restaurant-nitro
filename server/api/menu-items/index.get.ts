import { getAllMenuItemAction } from "~~/utils/actions/menuItem.action";

export default defineEventHandler(async (event) => {
  const response = await getAllMenuItemAction();

  return response;
});
