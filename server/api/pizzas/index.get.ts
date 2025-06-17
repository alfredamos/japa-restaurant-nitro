import { getAllPizzaAction } from "~~/utils/actions/pizza.action"


export default defineEventHandler(async(event) => {
  
  const response = await getAllPizzaAction();

  return response;
  
})