import { OrderDetail } from "@prisma/client";
import { Status } from "../auth/status.model";
import { UserResponseModel } from "../users/userResponse.model";

export class OrderModel {
  id!: string;
  userId!: string;
  user?: UserResponseModel;
  orderDetails: OrderDetail[] = [];
  orderDate!: Date;
  status!: Status;
  totalPrice!: number;
  totalQuantity!: number;
  paymentId: string;
}
