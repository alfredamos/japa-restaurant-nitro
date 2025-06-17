import type { Pizza } from "@prisma/client";
import { PizzaDb } from "~~/utils/db/menuItem.db";
import type { PizzaModel } from "~~/models/auth/pizza.model";

type PizzaWithoutId = Omit<Pizza, "id">;

export const createPizzaAction = async (pizza: PizzaWithoutId) => {
  console.log("In action, pizza : ", pizza)
  
  //----> Get the pizza from the request.
  const { name, price, topping, quantity, image, description, userId } =
    pizza;
  //----> Store the new pizza in the database.
  return await PizzaDb.createPizza({
    name,
    price: +price,
    topping,
    quantity: +quantity,
    image,
    description,
    userId,
  });
  
};

export const deletePizzaByIdAction = async ( id: string ) => {
  //----> Delete the pizza from the database.
  const deletedPizza = await PizzaDb.deletedPizza(id);
  //----> Send back the response.
  return deletedPizza;
};

export const editOnePizzaAction = async (pizza: Pizza) => {
  //----> Get the pizza to update from request.
  const { name, price, topping, quantity, image, description, userId, id } =
    pizza;
  //----> Delete the pizza from the database.
  const editedPizza = await PizzaDb.editPizza(id, {
    name,
    price: +price,
    topping,
    quantity: +quantity,
    image,
    description,
    userId,
  });
  //----> Send back the response.
  return editedPizza
};

export const editPizzaByIdAction = async (pizza: Pizza) => {
  //----> Get the pizza to update from request.
  const { name, price, topping, quantity, image, description, userId, id } =
    pizza;
  //----> Delete the pizza from the database.
  const editedPizza = await PizzaDb.editPizza(id, {
    name,
    price: +price,
    topping,
    quantity: +quantity,
    image,
    description,
    userId,
  });
  //----> Send back the response.
  return editedPizza
};

export const getAllPizzaAction = async () => {
  //----> Get all pizzas from the database.
  const pizza = await PizzaDb.getAllPizza();
  //----> Send back the response.
  return pizza;
};

export const getPizzaByIdAction = async (id: string) => {
  //----> Retrieve pizza from database.
  const pizza = await PizzaDb.detailPizza(id);
  //----> Send back the response back.
  return pizza;
};
