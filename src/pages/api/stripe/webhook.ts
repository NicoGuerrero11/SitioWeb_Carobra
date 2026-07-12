import type { APIRoute } from "astro";
import {
  appendOrderNote,
  getOrderById,
  markDistributorNotified,
  markOrderPaid,
  recordDistributorNotificationFailure,
} from "../../../utils/bookCommerce/orders";
import { sendDistributorOrderEmail } from "../../../utils/bookCommerce/resend";
import { getStripeWebhookSecret } from "../../../utils/bookCommerce/config";
import {
  buildPaidOrderUpdate,
  getStripeClient,
  isOrderValidationError,
} from "../../../utils/bookCommerce/stripe";

function responseWithStatus(body: string, status = 200) {
  return new Response(body, { status });
}

export const POST: APIRoute = async ({ request }) => {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return responseWithStatus("Missing stripe signature.", 400);
  }

  try {
    const rawBody = await request.text();
    const stripe = getStripeClient();
    const event = stripe.webhooks.constructEvent(rawBody, signature, getStripeWebhookSecret());

    if (event.type !== "checkout.session.completed") {
      return responseWithStatus("Event ignored.", 200);
    }

    const session = event.data.object;
    const orderId = session.metadata?.order_id;

    if (!orderId) {
      console.error("Book checkout session completed without order_id metadata.");
      return responseWithStatus("Missing order metadata.", 400);
    }

    const order = await getOrderById(orderId);

    if (!order) {
      console.error(`Book order not found for Stripe event ${event.id}: ${orderId}`);
      return responseWithStatus("Order not found.", 404);
    }

    if (order.status === "paid") {
      return responseWithStatus("Order already processed.", 200);
    }

    try {
      const paidOrderUpdate = buildPaidOrderUpdate({
        order,
        eventId: event.id,
        session,
      });

      let paidOrder;

      try {
        paidOrder = await markOrderPaid(order.id, paidOrderUpdate);
      } catch (transitionError) {
        if (transitionError instanceof Error && transitionError.message.includes("no longer pending")) {
          return responseWithStatus("Order already processed.", 200);
        }

        throw transitionError;
      }

      try {
        await sendDistributorOrderEmail(paidOrder);
        await markDistributorNotified(paidOrder.id);
      } catch (emailError) {
        console.error(`Distributor email failed for order ${paidOrder.publicOrderNumber}:`, emailError);
        await recordDistributorNotificationFailure(
          paidOrder.id,
          emailError instanceof Error ? emailError.message : "Unknown email failure",
        );
      }
    } catch (error) {
      if (isOrderValidationError(error)) {
        console.error(`Book payment validation anomaly for ${order.publicOrderNumber}:`, error.message);
        await appendOrderNote(order.id, error.message);
        return responseWithStatus("Validation anomaly recorded.", 200);
      }

      throw error;
    }

    return responseWithStatus("Webhook processed.", 200);
  } catch (error) {
    console.error("Stripe webhook processing error:", error);
    return responseWithStatus("Webhook processing failed.", 500);
  }
};
