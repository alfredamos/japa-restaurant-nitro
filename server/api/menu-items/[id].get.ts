import { getMenuItemByIdAction } from "~~/utils/actions/menuItem.action";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  const response = await getMenuItemByIdAction(id);

  return response;
});
