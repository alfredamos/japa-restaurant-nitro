import { Order } from "@prisma/client";
import { editOrderByIdAction } from "~~/utils/actions/order.action";
import { useAuth } from "~~/utils/useAuth";

export default defineEventHandler(async (event) => {
  //----> Get owner and admin checker.
  const {ownerAndAdmin} = useAuth()
  
  const validatedBody = await readBody<Order>(event);

  //----> Check for ownership or admin.
  await ownerAndAdmin(validatedBody?.id)

  //----> Edit the given order.
  const response = await editOrderByIdAction(validatedBody);

  //----> Send back the response.
  return response;
})