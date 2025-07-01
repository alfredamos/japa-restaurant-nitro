import { StatusCodes } from "http-status-codes";
import prisma from "./prisma.db";
import { v4 as uuidv4 } from "uuid";
import { type OrderDetail, type Order, Status } from "@prisma/client";
import type { OrderPayload } from "~~/models/orders/orderPayload.model";

export class OrderDb {
  constructor() {}

  async orderCreate(orderPayload: OrderPayload) {
    //----> Calculate the totalQuantity, totalPrice and make order paymentId.
    const ordPayload = this.getTotalQuantityAndTotalPrice(orderPayload);
    console.log({ ordPayload });

    //----> Destructure ordPayload.
    const { orderDetails, ...rest } = ordPayload;

    //----> Insert the order in the database.
    const createdOrder = await prisma.order.create({
      data: {
        ...rest,
      },
    });

    //----> Insert the order-details in the database.
    const newOrderDetails = await this.createBatchOrderDetails(
      orderDetails,
      createdOrder?.id
    );

    //----> Send back the results.
    return { createdOrder, orderDetails: newOrderDetails };
  }

  async createOrder(orderDetails: OrderDetail[], order: Order) {
    //----> Store the new order info in the database.
    const createdOrder = await prisma.order.create({
      data: {
        ...order,
        orderDate: new Date(),
        orderDetails: {
          create: [...orderDetails],
        },
      },
      include: {
        orderDetails: true,
      },
    });

    return createdOrder;
  }

  async deleteAllOrders() {
    //----> Delete all the order-details first.
    await prisma.orderDetail.deleteMany({});

    //----> Delete all orders.
    const numberOfOrders = (await prisma.order.deleteMany({})).count;

    //----> Check for empty array of orders.
    if (!numberOfOrders) {
      throw createError({
        statusCode: StatusCodes.NOT_FOUND,
        statusMessage: "Orders are not available in the database!",
        stack: "Empty table!",
      });
    }

    //----> Send back the response.
    return {
      status: "success",
      message: "All orders are deleted successfully!",
    };
  }

  async deleteAllOrderDetailByOrderId(orderId: string) {
    //----> Check for the existence of order in the database.
    const retrieveOrder = await this.getOrderById(orderId);
    //----> Adjust the total cost and total quantity on the order.
    const modifiedOrder = this.adjustTotalPriceAndTotalQuantity(retrieveOrder);
    //----> Delete the order info from the database.
    await prisma.order.update({
      where: { id: orderId },
      data: {
        ...modifiedOrder,
        orderDetails: {
          deleteMany: {},
        },
      },
      include: {
        orderDetails: true,
      },
    });
    //----> Clean up the order cart.
    await prisma.order.delete({ where: { id: orderId } });
  }

  async deleteOneOrderDetailByOrderId(orderDetailId: string, orderId: string) {
    //----> Check for the existence of order in the database.
    const { orderDetails, ...rest } = await this.getOrderById(orderId, true);
    //----> Filter out the cart-item to be deleted.
    const filteredOrderDetails = this.orderDetailFilter(
      orderDetails,
      orderDetailId
    );
    //----> Adjust the total cost and total quantity on the order.
    const modifiedOrder = this.adjustTotalPriceAndTotalQuantity(
      rest,
      filteredOrderDetails
    );
    //----> Delete the order info from the database.
    const deletedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...modifiedOrder,
        orderDetails: {
          deleteMany: [{ id: orderDetailId }],
        },
      },
      include: {
        orderDetails: true,
      },
    });

    return { deletedOrder, filteredOrderDetails };
  }

  async deleteOrderById(id: string) {
    //----> Delete all associated cart-items.
    await prisma.order.update({
      where: { id },
      data: {
        orderDetails: {
          deleteMany: {},
        },
      },
      include: {
        orderDetails: true,
        user: true,
      },
    });
    //----> Delete the order info from the database.
    const deletedOrder = await prisma.order.delete({
      where: { id },
      include: { orderDetails: true, user: true },
    });

    return deletedOrder;
  }

  async deleteOrdersByUserId(userId: string) {
    //----> Get the customer with the user-id.
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw createError({
        statusCode: StatusCodes.UNAUTHORIZED,
        statusMessage: "Invalid credentials!",
        stack: "Access denied",
      });
    }

    //----> Get all the orders by customerId.
    const orders = await prisma.order.findMany({
      where: { userId: user?.id },
    });

    //----> Check for availability of orders.
    if (!!orders.length) {
      //----> Delete all these others in the database.
      this.allOrdersDeletedByUserId(orders, user?.id);

      //----> Send back the result.
      return {
        status: "success",
        message: "All orders are deleted successfully!",
      };
    } else {
      //----> Send back the result.
      return {
        status: "fail",
        message: "No orders available in database!",
      };
    }
  }

  async editAllOrderDetailsByOrderId(
    orderId: string,
    orderDetails: OrderDetail[],
    order: Order
  ) {
    //----> Adjust the total-price and total-quantity on order.
    const modifiedOrder = this.adjustTotalPriceAndTotalQuantity(
      order,
      orderDetails
    );
    //----> Store the edited order info in the database.
    const editedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { ...modifiedOrder },
    });
    //----> Edit all cart-items.
    const updatedOrderDetails = await this.updateAllOrderDetails(
      orderDetails,
      orderId
    );

    return { editedOrder, updatedOrderDetails };
  }

  async editOrder(id: string, orderToEdit: Order) {
    //----> Store the edited order info in the database.
    const editedOrder = await prisma.order.update({
      where: { id },
      data: { ...orderToEdit },
    });

    return editedOrder;
  }

  async getAllOrders() {
    //----> Get all the orders from the database.
    const allOrders = await prisma.order.findMany({
      include: { orderDetails: true, user: true },
    });

    //----> Check for existence of orders.
    if (!allOrders.length) {
      throw createError({
        statusCode: StatusCodes.NOT_FOUND,
        statusMessage: "Orders are not available in the database!",
        stack: "Empty table!",
      });
    }

    return allOrders;
  }

  async getAllOrdersByUserId(userId: string) {
    //----> Get all the orders from the database.
    const allOrders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderDetails: true,
        user: true,
      },
    });

    if (!allOrders.length) {
      throw createError({
        statusCode: StatusCodes.NOT_FOUND,
        message: "Orders are not available in the database for this user",
        stack: "Empty table!",
      });
    }

    return allOrders;
  }

  async getOneOrder(id: string) {
    //----> Check for the existence of order in the db.
    const order = await this.getOrderById(id, true);

    return order;
  }

  private async getOrderById(id: string, include: boolean = false) {
    //----> Retrieve the order info with this id from database.
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderDetails: include,
      },
    });

    //----> Check for existence of order.
    if (!order) {
      throw createError({
        stack: "stack",
        statusMessage: "Not found",
        statusCode: StatusCodes.NOT_FOUND,
        message: `Order with id : ${id} is not found!`,
      });
    }

    //----> Send back a valid order.
    return order;
  }

  private orderDetailFilter(
    orderDetails: OrderDetail[],
    orderDetailId: string
  ): OrderDetail[] {
    return orderDetails?.filter((carItem) => carItem.id !== orderDetailId);
  }

  private adjustTotalPriceAndTotalQuantity(
    order: Order,
    orderDetails: OrderDetail[] = []
  ): Order {
    //----> Calculate both the total cost and total quantity.
    const totalQuantity = orderDetails?.reduce(
      (acc, current) => acc + current.quantity,
      0
    );
    const totalPrice = orderDetails?.reduce(
      (acc, current) => acc + current.price * current.quantity,
      0
    );
    //----> Adjust the total cost and total quantity on the order.
    order.totalPrice = totalPrice;
    order.totalQuantity = totalQuantity;
    //----> Return the modified order.
    return order;
  }

  private async createBatchOrderDetails(
    orderDetails: OrderDetail[],
    orderId: string
  ) {
    //----> Include the order-id in the order-details.
    const ordDetails = orderDetails.map((ordDet: OrderDetail) => ({
      ...ordDet,
      orderId,
    }));

    //----> Insert all the order-details in the database.
    return await prisma.orderDetail.createMany({
      data: [...ordDetails],
      skipDuplicates: false,
    });
  }

  private createMultipleOrderDetails(
    orderDetails: OrderDetail[],
    orderId: string
  ) {
    //----> Created new order-details at once.
    const newOrderDetails = orderDetails.map(async (cart) => {
      console.log("In create multiple : ", cart);
      return await prisma.orderDetail.create({
        data: { ...cart, orderId },
      });
    });

    //----> Collect all created order details in Promise.all().
    const createdNewOrderDetails = Promise.all(newOrderDetails);

    //----> Return the created order details.

    return createdNewOrderDetails;
  }

  private updateAllOrderDetails(orderDetails: OrderDetail[], orderId: string) {
    //----> Edit all order-details at once.
    const editedAllOrderDetails = orderDetails.map(async (cart) => {
      return await prisma.orderDetail.update({
        where: { id: cart.id, orderId },
        data: { ...cart },
      });
    });

    //----> Collect all edited order details in Promise.all().
    const updatedOrderDetails = Promise.all(editedAllOrderDetails);

    //----> Return the updated order details.

    return updatedOrderDetails;
  }

  private allOrdersDeletedByUserId(orders: Order[], userId: string) {
    //----> Delete all orders by customerId
    const userOrders = orders?.filter((order) => order.userId === userId);
    userOrders?.forEach(async (order) => {
      //----> Delete all associated cart-items.
      await prisma.order.update({
        where: { id: order.id },
        data: {
          orderDetails: {
            deleteMany: {},
          },
        },
        include: {
          orderDetails: true,
        },
      });
      //----> Delete the order info from the database.
      await prisma.order.delete({ where: { id: order.id } });
    });
  }

  private getTotalQuantityAndTotalPrice(orderPayload: OrderPayload) {
    const paymentId = uuidv4(); //----> Generate paymentId

    const ordPayload = { ...orderPayload }; //----> Order payload temp.
    ordPayload.paymentId = paymentId;

    //----> Calculate totalQuantity.
    const totalQuantity = orderPayload?.orderDetails?.reduce(
      (accum, current) => accum + current.quantity,
      0
    );

    //----> Calculate totalQuantity and price.
    const totalPrice = orderPayload?.orderDetails?.reduce(
      (accum, current) => accum + current.quantity * current.price,
      0
    );

    ordPayload.totalPrice = totalPrice; //----> Total price.
    ordPayload.totalQuantity = totalQuantity; //----> Total quantity.
    ordPayload.orderDate = new Date(); //----> Order date.

    //---->
    return ordPayload;
  }
}

export const orderDb = new OrderDb();
