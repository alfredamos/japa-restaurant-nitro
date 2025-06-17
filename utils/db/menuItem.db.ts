import type { MenuItem } from "@prisma/client";
import prisma from "./prisma.db";
import { StatusCodes } from "http-status-codes";

type MenuItemWithoutId = Omit<MenuItem, "id">;

export class MenuItemDb {
  constructor() {}

  static async createMenuItem(menuItem: MenuItemWithoutId): Promise<MenuItem> {
    const newMenuItem = await prisma.menuItem.create({ data: menuItem as MenuItem });

    if (!newMenuItem) {
      throw createError({statusCode: StatusCodes.BAD_REQUEST, statusMessage: "MenuItem not created"});
    }

    return newMenuItem;
  }

  static async editMenuItem(id: string, menuItem: MenuItemWithoutId): Promise<MenuItem> {
    await this.detailMenuItem(id);

    const editedMenuItem = await prisma.menuItem.update({
      data: menuItem,
      where: { id },
    });

    if (!editedMenuItem) {
      throw createError({statusCode: StatusCodes.NOT_FOUND, statusMessage:`MenuItem with id: ${id} cannot be updated`});
    }

    return editedMenuItem;
  }

  static async deletedMenuItem(id: string): Promise<MenuItem> {
    await this.detailMenuItem(id);

    const deletedMenuItem = await prisma.menuItem.delete({ where: { id } });

    return deletedMenuItem;
  }

  static async detailMenuItem(id: string): Promise<MenuItem> {
    const menuItem = await prisma.menuItem.findUnique({ where: { id } });

    if (!menuItem) {
      throw createError({statusCode: StatusCodes.NOT_FOUND, statusMessage:`MenuItem with id: ${id} is not found`});
    }

    return menuItem;
  }

  static async getAllMenuItem(): Promise<MenuItem[]> {
    return await prisma.menuItem.findMany({});
  }
}
