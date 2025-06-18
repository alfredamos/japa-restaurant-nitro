import { MenuItem } from "@prisma/client";
import { createMenuItemAction } from "~~/utils/actions/menuItem.action";
import { menuItemSchema } from "~~/utils/validations/menuItem.validation";

export default defineEventHandler(async (event) => {
  const validatedBody = (await readValidatedBody(event, (body) =>
    menuItemSchema.parse(body)
  )) as MenuItem;

  const response = await createMenuItemAction(validatedBody);

  return response;
});
