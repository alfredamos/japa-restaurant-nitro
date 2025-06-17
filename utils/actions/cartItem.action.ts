import type { CartItem } from "@prisma/client";
import { CartItemDb } from "~~/utils/db/orderDetail.db";

export const createCartItem = async (cartItem: CartItem) => {
  
  //----> Store the new cart item in the database.
  const createdCartItem = await CartItemDb.createCartItem(cartItem);
  //----> Send back the response.

  return createdCartItem;
};

export const deleteCartItemById = async (id: string) => {
  //----> Delete the cart item from the database.
  const deletedCartItem = await CartItemDb.deletedCartItem(id);
  //----> Send back the response.
  return deletedCartItem;
};

export const editCartItemById = async (cartItemToUpdate: CartItem) => {
  //----> Destructure cartItem to update;
  const { id, ...rest } = cartItemToUpdate;
  //----> Delete the cart item from the database.
  const editedCartItem = await CartItemDb.editCartItem(id, rest);
  //----> Send back the response.
  return editedCartItem;
};

export const getAllCartItem = async () => {
  //----> Get all cart items from the database.
  const cartItem = await CartItemDb.getAllCartItems();
  //----> Send back the response.
  return cartItem;
};

export const getCartItemById = async (id: string ) => {
  //----> Retrieve cart item from database.
  const cartItem = await CartItemDb.detailCartItem(id);
  //----> Send back the response back.
  return cartItem;
};
