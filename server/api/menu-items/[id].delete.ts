import { deleteMenuItemByIdAction } from "~~/utils/actions/menuItem.action";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  const response = await deleteMenuItemByIdAction(id);

  return response;
});
