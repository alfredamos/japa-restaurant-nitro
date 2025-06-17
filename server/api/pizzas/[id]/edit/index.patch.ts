import { Pizza } from "@prisma/client";
import { editPizzaByIdAction } from "~~/utils/actions/pizza.action";
import { pizzaSchema } from "~~/utils/validations/pizza.validation";

export default defineEventHandler(async(event) => {
  const validatedBody = await readValidatedBody(event, (body) => pizzaSchema.parse(body)) as Pizza;

  const response = await editPizzaByIdAction(validatedBody);

  return response;
})