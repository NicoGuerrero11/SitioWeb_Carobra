## 1. Commerce Foundations

- [x] 1.1 Define the backend book product configuration with fixed price, currency, active flag, and environment contracts for Stripe, Neon, and Resend
- [x] 1.2 Implement the Neon order persistence layer and schema support for pending and paid book orders with operational fields
- [x] 1.3 Add isolated server-side modules for Stripe client access, Resend email delivery, and shared order mapping utilities

## 2. Checkout Initiation Flow

- [x] 2.1 Implement `POST /api/checkout/create-session` to validate the book request, create a pending internal order, create a Stripe Checkout session, and return the checkout URL
- [x] 2.2 Connect the primary CTA on the book landing page to the live checkout initiation flow without changing unrelated site behavior
- [x] 2.3 Add a post-checkout `/gracias` page that communicates payment confirmation is pending webhook validation

## 3. Payment Confirmation and Notification

- [x] 3.1 Implement `POST /api/stripe/webhook` with signature verification, supported event handling, and safe rejection of invalid payloads
- [x] 3.2 Add paid-order persistence logic that validates amount and currency, stores customer and shipping details from Stripe, and records payment references and timestamps
- [x] 3.3 Implement idempotent distributor notification delivery through Resend after successful persistence of a paid order

## 4. Validation and Operational Readiness

- [x] 4.1 Verify duplicate webhook deliveries do not create repeated paid transitions or duplicate distributor emails
- [x] 4.2 Verify checkout failure, abandoned sessions, and notification failure paths preserve consistent order state
- [x] 4.3 Validate the end-to-end sandbox flow from landing CTA to paid order record and distributor email payload before release
