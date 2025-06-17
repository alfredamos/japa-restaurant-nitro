import { Order, OrderDetail } from "@prisma/client";

export class OrderProduct{
    order!: Order;
    orderDetails: OrderDetail[] = [];
}