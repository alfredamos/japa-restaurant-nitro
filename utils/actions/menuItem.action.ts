import type { MenuItem } from "@prisma/client";
import { MenuItemDb } from "../db/menuItem.db";

type MenuItemWithoutId = Omit<MenuItem, "id">;

export const createMenuItemAction = async (menuItem: MenuItemWithoutId) => {
  console.log("In action, menuItem : ", menuItem)
  
  //----> Get the menuItem from the request.
  const { itemName, category, price, image, description, specialTag, userId } =
    menuItem;
  //----> Store the new menuItem in the database.
  return await MenuItemDb.createMenuItem({
    category,
    itemName,
    price: +price,
    image,
    description,
    specialTag,
    userId,
  });
  
};

export const deleteMenuItemByIdAction = async ( id: string ) => {
  //----> Delete the menuItem from the database.
  const deletedMenuItem = await MenuItemDb.deletedMenuItem(id);
  //----> Send back the response.
  return deletedMenuItem;
};

export const editOneMenuItemAction = async (menuItem: MenuItem) => {
  //----> Get the menuItem to update from request.
  const { itemName, price, specialTag, category, image, description, userId, id } =
    menuItem;
  //----> Delete the menuItem from the database.
  const editedMenuItem = await MenuItemDb.editMenuItem(id, {
    itemName,
    price: +price,
    category,
    image,
    description,
    specialTag,
    userId,
  });
  //----> Send back the response.
  return editedMenuItem
};

export const editMenuItemByIdAction = async (menuItem: MenuItem) => {
  //----> Get the menuItem to update from request.
  const { itemName, price, category, specialTag, image, description, userId, id } =
    menuItem;
  //----> Delete the menuItem from the database.
  const editedMenuItem = await MenuItemDb.editMenuItem(id, {
    itemName,
    price: +price,
    category,
    specialTag,
    image,
    description,
    userId,
  });
  //----> Send back the response.
  return editedMenuItem
};

export const getAllMenuItemAction = async () => {
  //----> Get all menuItems from the database.
  const menuItem = await MenuItemDb.getAllMenuItem();
  //----> Send back the response.
  return menuItem;
};

export const getMenuItemByIdAction = async (id: string) => {
  //----> Retrieve menuItem from database.
  const menuItem = await MenuItemDb.detailMenuItem(id);
  //----> Send back the response back.
  return menuItem;
};
