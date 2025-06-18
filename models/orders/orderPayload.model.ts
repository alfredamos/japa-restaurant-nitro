import { OrderDetail, Status } from "@prisma/client";

export class OrderPayload {
  id: string = "";
  orderDetails: OrderDetail[] = [];
  paymentId: string = "qysk47dipmdhy68";
  userId: string = "";
  totalPrice: number = 0;
  totalQuantity: number = 0;
  orderDate: Date = new Date();
  status: Status;
}
