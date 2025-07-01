import type { Order } from "@prisma/client";
import { orderDb } from "~~/utils/db/order.db";
import type { OrderPayload } from "~~/models/orders/orderPayload.model";
import type { OrderProduct } from "~~/models/orders/orderProduct.model";

export const createOrderAction = async (orderProduct: OrderProduct) => {
  //----> Get the order info from the request body.
  const { orderDetails, order } = orderProduct;

  //----> Store the new order info in the database.
  const createdOrder = await orderDb.createOrder(orderDetails, order);

  //----> Send back the response.
  return createdOrder;
};

export const orderCreateAction = async (orderPayload: OrderPayload) => {
  console.log("In order-create-action, orderPayload : ", orderPayload);
  //----> Store the new order info in the database.
  const createdOrder = await orderDb.orderCreate(orderPayload);

  //----> Send back the response.
  return createdOrder;
};

export const deleteOrderByIdAction = async (id: string) => {
  //----> Delete all associated cart-items.
  const deletedOrder = await orderDb.deleteOrderById(id);
  //----> Send back the response.
  return deletedOrder;
};

export const deleteAllOrdersAction = async() => {
  const response = await orderDb.deleteAllOrders()

  return response
}

export const deleteOrdersByUserIdAction = async (userId: string) => {
  //----> Delete orders user id.
  const result = await orderDb.deleteOrdersByUserId(userId);
  //----> Send back the response.
  return result
};

export const editOrderByIdAction = async (orderToEdit: Order) => {
  const { id } = orderToEdit;
  //----> Store the edited order info in the database.
  const editedOrder = await orderDb.editOrder(id, orderToEdit);
  //----> Send back the response.
  return editedOrder;
};

export const getAllOrdersAction = async () => {
  //----> Get all the orders from the database.
  const allOrders = await orderDb.getAllOrders();

  //----> Send back the response.
  return allOrders;
};

export const getAllOrdersByUserIdAction = async (userId: string) => {
  //----> Get all orders from the database.
  const allOrders = await orderDb.getAllOrdersByUserId(userId);
  //----> Send back the response.
  return allOrders;
};

export const getOrderByIdAction = async (id: string) => {
  //----> Check for the existence of order in the db.
  const order = await orderDb.getOneOrder(id);

  //----> Send back the response.
  return order;
};
