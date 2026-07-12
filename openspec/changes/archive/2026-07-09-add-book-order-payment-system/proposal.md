## Why

Carobra ya cuenta con una landing del libro, pero hoy no existe un flujo confiable para convertir interés en ventas confirmadas. Se necesita un módulo aislado que permita cobrar con Stripe, persistir órdenes pagadas y notificar al distribuidor por Resend sin depender del email como fuente de verdad.

## What Changes

- Add a dedicated book commerce flow that creates internal pending orders before redirecting buyers to Stripe Checkout.
- Add a Stripe webhook flow that validates payment events, marks matching orders as paid, and persists customer and shipping data from Stripe.
- Add operational email notifications through Resend so the distributor receives a structured order summary after payment confirmation.
- Add a post-checkout confirmation page that informs the buyer while clarifying that payment confirmation depends on webhook processing.
- Update the existing book landing CTA so it becomes the real entrypoint into the purchase flow without changing unrelated site behavior.

## Capabilities

### New Capabilities
- `book-order-payment`: Covers order creation, Stripe Checkout session creation, trusted payment confirmation through webhook processing, Neon order persistence, and Resend distributor notifications.

### Modified Capabilities
- `book-landing`: Change the purchase CTA requirement so the landing launches the live commerce flow instead of remaining only prepared for a future integration.

## Impact

- Affected code: book landing page, new API routes for checkout and Stripe webhook handling, thank-you page, and new supporting server-side modules for product config, persistence, and email delivery.
- Affected systems: Stripe for payments, Neon for canonical order storage, and Resend for transactional notifications to the distributor.
- Constraints: the module must remain isolated from existing contact and career flows and must not regress current marketing pages.
