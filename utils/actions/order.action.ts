import type { Order } from "@prisma/client";
import { orderDb } from "~~/utils/db/order.db";
import type { OrderPayload } from "~~/models/orders/orderPayload.model";
import type { OrderProduct } from "~~/models/orders/orderProduct.model";


export const createOrderAction = async (orderProduct: OrderProduct) => {
    //----> Get the order info from the request body.
    const {cartItems, order} = orderProduct;

    //----> Store the new order info in the database.
    const createdOrder = await orderDb.createOrder(cartItems, order);

    //----> Send back the response.
    return createdOrder;
  };

export const orderCreateAction = async (orderPayload: OrderPayload) => {
  //----> Store the new order info in the database.
  const createdOrder = await orderDb.orderCreate(orderPayload);

  //----> Send back the response.
  return createdOrder;
}

export const deleteOrderByIdAction = async (id: string) => {
    //----> Delete all associated cart-items.
    const deletedOrder = await orderDb.deleteOrderById(id);
    //----> Send back the response.
    return deletedOrder;
  };

export const deleteOrdersByUserIdAction = async (userId: string) => {
    //----> Delete orders user id.
    await orderDb.deleteOrdersByUserId(userId);
    //----> Send back the response.
    return {
      message:
        "All Orders associated with this customer have been deleted successfully!",
    }
  };


export const editOrderByIdAction = async (orderToEdit: Order) => {
    const {id} = orderToEdit
    //----> Store the edited order info in the database.
    const editedOrder = await orderDb.editOrder(id, orderToEdit);
    //----> Send back the response.
    return editedOrder
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

export const orderDeliveredAction = async (orderId: string) => {
    //----> Update the delivering information.
    const updatedOrder = await orderDb.orderDelivered(orderId);
    //----> Send back the response
    return updatedOrder;
  };

export const orderShippedAction = async (orderId: string) => {
    //----> Update the shipping information.
    const updatedOrder = await orderDb.orderShipped(orderId);
    //----> Send back the response
    return updatedOrder;
  };