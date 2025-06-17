import Stripe from "stripe"
import { orderDb } from "~~/utils/db/order.db";
import { stripeDb } from "~~/utils/db/stripe.db";
import type { OrderPayload } from "~~/models/orders/orderPayload.model";


export async function createPaymentIntent(amount: number, description: string){
  const stripeSecretKey = useRuntimeConfig().stripeSecretKey;
  
  const stripe = new Stripe(stripeSecretKey,{
    typescript: true,
    apiVersion: "2025-01-27.acacia"
  });

  const {id, description : desc, client_secret} = await stripe.paymentIntents.create({amount, description, currency: "usd"});


  return {id, description, client_secret};
}

export async function stripePaymentCheckout(orderPayload: OrderPayload, origin: string){

    const sessionPayload = await stripeDb.paymentCheckout(orderPayload, origin);

    //-----> If there's sessionPayload, then store the order in the database.
    if (sessionPayload?.id) {
      orderPayload.paymentId = sessionPayload?.id;
      orderPayload.orderDate = new Date();
      await orderDb.orderCreate(orderPayload);
    }

    return sessionPayload;
}