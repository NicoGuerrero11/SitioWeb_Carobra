import Stripe from "stripe";
import { getAllowedShippingCountries, getStripeSecretKey } from "./config";
import type { BookOrderRecord, BookProductConfig, PaidOrderUpdate } from "./types";

let stripeClient: Stripe | null = null;

class OrderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderValidationError";
  }
}

export function getStripeClient() {
  if (!stripeClient) {
    stripeClient = new Stripe(getStripeSecretKey());
  }

  return stripeClient;
}

export async function createCheckoutSession(params: {
  order: BookOrderRecord;
  product: BookProductConfig;
  origin: string;
}) {
  const stripe = getStripeClient();
  const allowedShippingCountries = getAllowedShippingCountries();

  return stripe.checkout.sessions.create({
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    shipping_address_collection: {
      allowed_countries:
        allowedShippingCountries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
    },
    success_url: `${params.origin}/gracias/?order=${encodeURIComponent(params.order.publicOrderNumber)}`,
    cancel_url: `${params.origin}/libro/#compra`,
    line_items: [
      {
        quantity: params.order.quantity,
        price_data: {
          currency: params.product.currency,
          unit_amount: params.product.unitAmount,
          product_data: {
            name: params.product.title,
            metadata: {
              book_slug: params.product.slug,
            },
          },
        },
      },
    ],
    metadata: {
      order_id: params.order.id,
      public_order_number: params.order.publicOrderNumber,
      book_slug: params.product.slug,
    },
  });
}

function toNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

export function buildPaidOrderUpdate(params: {
  order: BookOrderRecord;
  eventId: string;
  session: Stripe.Checkout.Session;
}): PaidOrderUpdate {
  const { order, session, eventId } = params;

  if (!session.id) {
    throw new OrderValidationError("Stripe session is missing an id.");
  }

  if (session.amount_total !== order.amountTotal) {
    throw new OrderValidationError(
      `Amount mismatch for order ${order.publicOrderNumber}: expected ${order.amountTotal}, got ${session.amount_total}.`,
    );
  }

  if ((session.currency ?? "").toLowerCase() !== order.currency.toLowerCase()) {
    throw new OrderValidationError(
      `Currency mismatch for order ${order.publicOrderNumber}: expected ${order.currency}, got ${session.currency}.`,
    );
  }

  const shippingDetails = session.collected_information?.shipping_details;
  const customerDetails = session.customer_details;
  const customerName = toNullableString(shippingDetails?.name ?? customerDetails?.name);
  const customerEmail = toNullableString(customerDetails?.email);
  const customerPhone = toNullableString(customerDetails?.phone);

  if (!customerEmail) {
    throw new OrderValidationError(`Customer email is missing for order ${order.publicOrderNumber}.`);
  }

  return {
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null,
    stripeCustomerId: typeof session.customer === "string" ? session.customer : session.customer?.id ?? null,
    stripeLastEventId: eventId,
    customerName,
    customerEmail,
    customerPhone,
    shippingLine1: toNullableString(shippingDetails?.address?.line1),
    shippingLine2: toNullableString(shippingDetails?.address?.line2),
    shippingCity: toNullableString(shippingDetails?.address?.city),
    shippingState: toNullableString(shippingDetails?.address?.state),
    shippingPostalCode: toNullableString(shippingDetails?.address?.postal_code),
    shippingCountry: toNullableString(shippingDetails?.address?.country),
    shippingReference: null,
    amountTotal: session.amount_total ?? order.amountTotal,
    currency: (session.currency ?? order.currency).toLowerCase(),
    paidAt: new Date().toISOString(),
  };
}

export function isOrderValidationError(error: unknown): error is OrderValidationError {
  return error instanceof OrderValidationError;
}
