import Stripe from "stripe";
import { environment } from "~~/environments/environment.dev";
import type { OrderPayload } from "~~/models/orders/orderPayload.model";

export class StripeDb {
  
  stripe: Stripe;
  readonly stripeSecretKey = useRuntimeConfig()?.stripeSecretKey;

  constructor(){
    //-----> Load stripe
    this.stripe = new Stripe(this.stripeSecretKey);
  }

  async paymentCheckout(orderPayload: OrderPayload, origin: string) {
    //----> Destructure orderPayload.
    const { cartItems } = orderPayload;

    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        ...cartItems?.map((cart) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: cart.name,
              images: [cart.image],
            },
            unit_amount: cart.price * 100,
          },
          quantity: cart.quantity,
        })),
      ],
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${origin}/orders/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/orders/payment-failure`,
    });

    const { id, url, status, } = session;

    return { id, url, status };
  }

}

export const stripeDb = new StripeDb();