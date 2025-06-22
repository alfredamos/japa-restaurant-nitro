import { Order } from "@prisma/client";
import { editOrderByIdAction } from "~~/utils/actions/order.action";
import { ownerAndAdmin } from "~~/utils/ownerAndAdmin";

export default defineEventHandler(async (event) => {
  const validatedBody = await readBody<Order>(event);

   //----> Check for ownership or admin.
    await ownerAndAdmin(validatedBody?.id)

  //----> Edit the given order.
  const response = await editOrderByIdAction(validatedBody);

  //----> Send back the response.
  return response;
})