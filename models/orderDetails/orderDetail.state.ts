import { OrderDetail } from "@prisma/client";

export class OrderDetailState {
  OrderDetails: OrderDetail[] = [];
  isAddToCart: boolean = false;
}
