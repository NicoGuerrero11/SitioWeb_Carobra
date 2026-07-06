# Book Commerce System Contract

## Purpose

This document defines the technical contract for building a book sales system inside the Carobra website.

The goal is to add:

- a new section/page to present the book
- a secure purchase flow with Stripe Checkout
- order persistence in Neon
- transactional notifications with Resend
- an operational flow so logistics can fulfill paid orders

This document is intentionally detailed so implementation can begin with minimal ambiguity.

## Scope

This first version covers the sale of a physical book.

Included:

- product presentation page or section
- buy button
- Stripe Checkout payment flow
- order creation before payment
- secure Stripe webhook confirmation
- order persistence in Neon
- logistics notification by email through Resend
- optional customer confirmation email
- manual post-payment order handling by the team

Not included in v1:

- full admin panel
- dynamic shipping carrier integration
- automated label generation
- invoice generation
- multi-product cart
- discount/coupon system
- automated refund workflows

## Non-Regression Constraint

This system must be built as an isolated module and must not modify unrelated existing site behavior.

The current website outside the new book commerce feature must remain functionally intact.

This means:

- existing pages must preserve their current structure and behavior
- existing contact and career flows must continue working without behavior changes
- current APIs must not be repurposed for the book commerce flow
- the new commerce logic must live in new routes, new endpoints, and dedicated supporting code
- existing shared layout/components may only receive minimal integration changes required to link to the new book section

Allowed integration:

- adding a new section or page for the book
- adding CTA links from existing pages to the new book area
- adding new API endpoints dedicated to checkout and webhook processing
- adding new database integration and email templates for this feature

Not allowed unless explicitly approved later:

- changing existing marketing flows beyond minimal linking
- changing the current contact submission flow
- changing the current career submission flow
- embedding book purchase logic into unrelated existing endpoints

## Business Goal

The system must allow a visitor to buy a physical book and ensure the team receives a reliable, structured record of the purchase, including shipping information, after payment is confirmed.

The system must not depend on email as the source of truth.

Source of truth by responsibility:

- Stripe: payment processing and payment confirmation events
- Neon: canonical order record and order lifecycle
- Resend: operational notifications
- Astro: presentation layer and backend orchestration

## System Overview

```text
Book landing page
   ↓
User clicks "Buy"
   ↓
POST /api/checkout/create-session
   ↓
Neon creates order with status = pending
   ↓
Stripe Checkout session is created
   ↓
User completes payment and shipping details in Stripe
   ↓
User is redirected to /gracias
   ↓
Stripe sends webhook to /api/stripe/webhook
   ↓
Webhook validates signature
   ↓
Webhook updates order in Neon to paid
   ↓
Webhook stores customer + shipping details from Stripe
   ↓
Webhook sends logistics email with Resend
   ↓
Optional customer confirmation email
```

## Integration Boundary

```text
Existing site
├── current marketing pages
├── current contact flow
├── current career flow
└── existing shared layout/components

New isolated book commerce module
├── new book landing page/section
├── new checkout initiation endpoint
├── new Stripe webhook endpoint
├── new order persistence layer
└── new Resend transactional emails
```

The new commerce module may be linked from the existing site, but it must not introduce breaking coupling into current site functionality.

## Design Principles

1. Payment confirmation must come only from the Stripe webhook.
2. The frontend must never mark an order as paid.
3. The backend must create an internal order before redirecting to Stripe.
4. Shipping information must be stored in Neon before sending logistics email.
5. Notifications must be downstream effects, not the source of record.
6. The webhook must be idempotent.
7. Backend pricing must be authoritative; frontend pricing is display only.
8. The feature must be integrated without altering unrelated existing site behavior.

## User Flow

### 1. Discovery

The user lands on the book page and reviews:

- cover and marketing visuals
- description of the book
- benefits/value proposition
- price
- purchase CTA

### 2. Checkout Initiation

When the user clicks the purchase CTA:

- the frontend calls the backend
- the backend determines the valid product and price
- the backend creates a pending order in Neon
- the backend creates a Stripe Checkout session
- the frontend redirects the user to Stripe Checkout

### 3. Customer Input

The checkout must collect enough information to allow fulfillment.

Required operational data:

- full name
- email
- shipping address
- postal code
- city
- state
- country
- optional address complement/reference

Recommended if feasible:

- phone number

Important:

The final shipping details used for fulfillment should come from Stripe Checkout session data after payment confirmation.

### 4. Post-Payment

After a successful payment:

- Stripe may redirect the user to `/gracias`
- this page is informational only
- the real confirmation happens when Stripe posts to the webhook

### 5. Fulfillment Notification

Once the webhook confirms the payment and persists the order update:

- Resend sends a logistics email
- the team uses the order record in Neon as the canonical operational reference

## Trust Boundaries

### Trusted

- Stripe webhook payload after signature verification
- Neon persisted records
- backend-managed product catalog values

### Not trusted

- frontend-submitted pricing
- query parameters on success pages
- client-side confirmation states
- any user claim that payment succeeded without webhook confirmation

## Product Model for v1

The first version assumes one physical book product.

Even with one product, the model should stay extensible.

Recommended backend product shape:

```text
book_slug
book_title
unit_amount
currency
active
```

The implementation can hardcode this in a config object for v1 if there is only one book.

## Order Lifecycle

### Order statuses

- `pending`
- `paid`
- `processing`
- `fulfilled`
- `cancelled`
- `refunded`

### Status meanings

`pending`
- order created internally
- checkout session may or may not have been completed
- payment not yet confirmed by webhook

`paid`
- Stripe webhook validated
- amount and currency accepted
- customer and shipping details stored

`processing`
- internal team acknowledged the order and is preparing shipment

`fulfilled`
- shipment was completed

`cancelled`
- order was abandoned or intentionally voided before fulfillment

`refunded`
- payment was refunded after capture

## Canonical Data Contract

## `orders` table

Recommended fields for Neon:

- `id` UUID primary key
- `public_order_number` text unique not null
- `status` text not null
- `book_slug` text not null
- `book_title` text not null
- `unit_amount` integer not null
- `quantity` integer not null
- `currency` text not null
- `amount_total` integer not null
- `customer_name` text null
- `customer_email` text null
- `customer_phone` text null
- `shipping_line_1` text null
- `shipping_line_2` text null
- `shipping_city` text null
- `shipping_state` text null
- `shipping_postal_code` text null
- `shipping_country` text null
- `shipping_reference` text null
- `stripe_checkout_session_id` text unique null
- `stripe_payment_intent_id` text unique null
- `stripe_customer_id` text null
- `stripe_last_event_id` text null
- `paid_at` timestamptz null
- `fulfilled_at` timestamptz null
- `notes_internal` text null
- `created_at` timestamptz not null
- `updated_at` timestamptz not null

### Why integer amounts

All monetary values should be stored in the smallest currency unit.

Examples:

- MXN 499.00 -> `49900`
- USD 25.00 -> `2500`

This avoids floating-point errors.

## Optional `order_status_history` table

Recommended if we want better operational traceability from the beginning.

Fields:

- `id` UUID primary key
- `order_id` UUID not null
- `from_status` text null
- `to_status` text not null
- `reason` text null
- `created_at` timestamptz not null

## API Contract

## Endpoint: `POST /api/checkout/create-session`

### Responsibility

Create a pending internal order and then create a Stripe Checkout session tied to that order.

### Request

Minimal request body:

```json
{
  "bookSlug": "k-no-tengo-dinero"
}
```

Optional request body if quantity is supported:

```json
{
  "bookSlug": "k-no-tengo-dinero",
  "quantity": 1
}
```

### Backend validations

- product exists
- product is active
- quantity is within allowed limits
- currency and amount come from server-side config

### Backend actions

1. Resolve product details from backend config.
2. Calculate total amount.
3. Create `orders` record in Neon with `pending`.
4. Create Stripe Checkout session.
5. Attach internal order identifier through metadata.
6. Return checkout URL.

### Stripe session requirements

The Checkout session should be configured to:

- collect payment
- collect customer email
- collect shipping address
- include metadata:
  - `order_id`
  - `book_slug`
- use absolute success and cancel URLs

If Stripe configuration allows, shipping countries should be explicitly constrained to supported destinations.

### Response

```json
{
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

### Failure behavior

If Neon order creation fails:

- do not create Stripe session
- return error

If Stripe session creation fails after order creation:

- return error
- keep the order as `pending`
- later cleanup of abandoned pending orders can be added

## Endpoint: `GET /gracias`

### Responsibility

Display a post-checkout confirmation page for the customer.

### Important rule

This page must not:

- write to the database
- mark orders as paid
- trigger logistics emails

### UX purpose

This page should communicate:

- the payment is being processed or validated
- the customer will receive confirmation
- support contact if needed

## Endpoint: `POST /api/stripe/webhook`

### Responsibility

Receive trusted payment events from Stripe and move the internal order into the correct business state.

### Required validations

1. Verify Stripe signature using the webhook secret.
2. Confirm the event type is supported.
3. Extract internal `order_id` from metadata.
4. Load matching order from Neon.
5. Confirm the order exists.
6. Validate amount and currency.
7. Ensure idempotent behavior before mutating state.

### Primary event in v1

- `checkout.session.completed`

### Supported future events

- `charge.refunded`
- `payment_intent.payment_failed`
- `checkout.session.expired`

### Webhook mutation flow

1. Verify signature.
2. Parse event.
3. Ignore unsupported event types safely.
4. Resolve internal order from metadata.
5. Compare expected amount with Stripe amount.
6. Compare expected currency with Stripe currency.
7. If order is already `paid`, treat as duplicate and return success.
8. Update order to `paid`.
9. Persist Stripe references.
10. Persist customer and shipping details from Stripe.
11. Persist `paid_at`.
12. Send logistics email through Resend.
13. Optionally send customer email.

### Required data persisted from Stripe

- checkout session id
- payment intent id
- customer id if available
- customer full name
- customer email
- phone if available
- shipping address fields
- amount total
- currency
- payment timestamp

### Failure rules

If signature validation fails:

- reject request
- do not process anything

If order is missing:

- log high-priority operational error
- do not fabricate a replacement order in webhook

If amount or currency mismatch:

- do not mark as paid automatically
- log anomaly for review

If Neon persistence fails:

- return failure so Stripe can retry webhook

If Resend email fails after Neon update succeeds:

- do not roll back order state
- log notification failure
- allow manual re-send later

## Idempotency Contract

Stripe may deliver webhook events more than once.

The system must therefore ensure that repeated delivery of the same event does not:

- duplicate status transitions
- duplicate confirmation emails
- duplicate logistics emails

Recommended controls:

- store `stripe_last_event_id`
- check whether order is already `paid`
- gate notifications so they only fire on the first successful transition to `paid`

## Shipping Data Contract

The shipping address must be captured and later rendered in the logistics email.

Minimum expected fields:

- recipient full name
- line 1
- line 2 optional
- city
- state
- postal code
- country
- reference optional

Preferred source:

- Stripe Checkout session shipping/customer details after payment confirmation

Reason:

- it reduces divergence between pre-checkout forms and actual paid session data
- it keeps fulfillment tied to the confirmed payment record

## Email Contract

## Logistics email

Trigger:

- after order transitions successfully from `pending` to `paid`

Recipient:

- internal logistics address or distribution list

Subject recommendation:

```text
Nueva compra de libro - Pedido {public_order_number}
```

Required email content:

- public order number
- internal order id
- purchase date
- customer name
- customer email
- customer phone if available
- product title
- quantity
- amount paid
- Stripe payment reference
- full shipping address
- shipping reference if present

## Customer confirmation email

Optional in v1 but strongly recommended.

Contents:

- order number
- product summary
- amount paid
- shipping confirmation summary
- support contact

## Security Requirements

1. Stripe secret keys must remain server-side only.
2. Webhook signing secret must be mandatory in production.
3. Product pricing must be backend-owned.
4. Checkout session metadata must include internal order reference.
5. The success page must never replace webhook confirmation.
6. Database writes in the webhook must happen before email side effects.
7. Logging must avoid leaking secrets.

## Operational Requirements

The team must be able to:

- find all paid orders in Neon
- inspect shipping details
- distinguish pending vs paid orders
- manually update orders to `processing` and `fulfilled`
- identify notification failures if they happen

For v1, manual order management directly in Neon is acceptable.

## Error Scenarios

### Scenario 1: order created, Stripe session creation fails

Expected result:

- order remains `pending`
- user receives an error
- no payment occurs

### Scenario 2: customer pays, redirect works, webhook delayed

Expected result:

- `/gracias` shows informational state only
- order becomes `paid` only when webhook succeeds

### Scenario 3: webhook repeats same event

Expected result:

- system returns success
- state is not duplicated
- emails are not duplicated

### Scenario 4: payment confirmed, logistics email fails

Expected result:

- order remains `paid`
- notification failure is logged
- manual resend path remains possible

### Scenario 5: amount mismatch between internal order and Stripe payload

Expected result:

- do not auto-confirm order
- flag for manual review

## Recommended Environment Variables

### Stripe

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Neon

- `DATABASE_URL`

### Resend

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `LOGISTICS_NOTIFICATION_EMAIL`

### App URLs

- `PUBLIC_SITE_URL`

## Recommended Implementation Phases

### Phase 1: foundation

- define product config for the book
- provision Neon schema
- connect Stripe server SDK
- connect Resend server SDK

### Phase 2: purchase flow

- implement `POST /api/checkout/create-session`
- add CTA on book page
- implement `/gracias`

### Phase 3: confirmation flow

- implement Stripe webhook
- persist final customer/shipping data
- send logistics email
- test idempotency

### Phase 4: operational polish

- add customer confirmation email
- add status history
- add manual internal notes
- add cleanup strategy for stale `pending` orders

## Testing Requirements

Minimum tests to perform before release:

- create-session creates a `pending` order
- create-session returns valid Stripe URL
- webhook with valid signature updates order to `paid`
- webhook duplicate does not duplicate email
- webhook with invalid signature is rejected
- webhook mismatch amount does not auto-confirm order
- logistics email contains full shipping details

## Final Contract Summary

This system must be built as a controlled payment workflow, not as a simple button-to-email flow.

The required chain is:

```text
Frontend intent
→ internal pending order
→ Stripe Checkout
→ trusted webhook
→ Neon update
→ Resend notification
```

If any future implementation violates that order of operations, it should be considered out of contract unless there is a documented design change.
