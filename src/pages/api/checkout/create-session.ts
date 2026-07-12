import type { APIRoute } from "astro";
import { getBookProductConfig, getRequestOrigin } from "../../../utils/bookCommerce/config";
import { attachCheckoutSessionId, createPendingOrder } from "../../../utils/bookCommerce/orders";
import { createCheckoutSession } from "../../../utils/bookCommerce/stripe";

interface CheckoutRequestBody {
  bookSlug?: string;
  quantity?: number;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = (await request.json()) as CheckoutRequestBody;
    const product = getBookProductConfig();
    const requestedSlug = payload.bookSlug?.trim();
    const quantity = Number.isInteger(payload.quantity) ? Number(payload.quantity) : 1;

    if (!requestedSlug) {
      return jsonResponse({ error: "El libro solicitado es requerido." }, 400);
    }

    if (requestedSlug !== product.slug || !product.active) {
      return jsonResponse({ error: "El producto solicitado no esta disponible." }, 400);
    }

    if (quantity <= 0 || quantity > product.maxQuantity) {
      return jsonResponse({ error: "La cantidad solicitada no es valida." }, 400);
    }

    const order = await createPendingOrder({
      product,
      quantity,
    });

    const session = await createCheckoutSession({
      order,
      product,
      origin: getRequestOrigin(request.url),
    });

    if (!session.url || !session.id) {
      return jsonResponse({ error: "No fue posible crear la sesion de pago." }, 500);
    }

    await attachCheckoutSessionId(order.id, session.id);

    return jsonResponse({
      checkoutUrl: session.url,
      orderNumber: order.publicOrderNumber,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return jsonResponse(
      { error: "No fue posible iniciar la compra del libro en este momento." },
      500,
    );
  }
};
