import { OrderDetail } from "@prisma/client";

export class MenuItem {
  id: string = '';
  itemName: string = '';
  category: string = '';
  specialTag: string = '';
  price: number = 0;
  image: string = '';
  description: string = '';
  orderDetails?: OrderDetail[] = [];
  userId: string = '';
}
