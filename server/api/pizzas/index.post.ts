import { Pizza } from "@prisma/client";
import { createPizzaAction} from "~~/utils/actions/pizza.action";
import { pizzaSchema } from "~~/utils/validations/pizza.validation";

export default defineEventHandler(async(event) => {
  const validatedBody = await readValidatedBody(event, (body) => pizzaSchema.parse(body)) as Pizza;

  const response = await createPizzaAction(validatedBody);

  return response;
})