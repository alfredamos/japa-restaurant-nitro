import type { OrderDetail } from "@prisma/client";
import { OrderDetailDb } from "~~/utils/db/orderDetail.db";

export const createOrderDetail = async (orderDetail: OrderDetail) => {
  //----> Store the new cart item in the database.
  const createdOrderDetail = await OrderDetailDb.createOrderDetail(orderDetail);
  
  //----> Send back the response.
  return createdOrderDetail;
};

export const deleteOrderDetailById = async (id: string) => {
  //----> Delete the cart item from the database.
  const deletedOrderDetail = await OrderDetailDb.deletedOrderDetail(id);
  
  //----> Send back the response.
  return deletedOrderDetail;
};

export const editOrderDetailById = async (orderDetailToUpdate: OrderDetail) => {
  //----> Destructure orderDetail to update;
  const { id, ...rest } = orderDetailToUpdate;
  
  //----> Delete the cart item from the database.
  const editedOrderDetail = await OrderDetailDb.editOrderDetail(id, rest);
  
  //----> Send back the response.
  return editedOrderDetail;
};

export const getAllOrderDetail = async () => {
  //----> Get all cart items from the database.
  const orderDetail = await OrderDetailDb.getAllOrderDetails();
  
  //----> Send back the response.
  return orderDetail;
};

export const getOrderDetailById = async (id: string ) => {
  //----> Retrieve cart item from database.
  const orderDetail = await OrderDetailDb.detailOrderDetail(id);
  
  //----> Send back the response back.
  return orderDetail;
};
