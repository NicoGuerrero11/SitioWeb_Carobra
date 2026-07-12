## Purpose

Define the transactional contract for creating book orders, redirecting buyers to Stripe Checkout, confirming payment through a verified webhook, persisting fulfillment data in Neon, and notifying the distributor after successful payment.

## Requirements

### Requirement: Internal order must exist before checkout redirection
The system SHALL create an internal order record with status `pending` before redirecting a buyer to Stripe Checkout.

#### Scenario: Pending order is created before checkout
- **WHEN** a visitor starts a book purchase from the landing page
- **THEN** the backend creates an internal order with backend-authoritative product, currency, quantity, and amount values before creating the Stripe Checkout session

#### Scenario: Checkout session creation fails after order creation
- **WHEN** the order has been created in Neon but Stripe session creation fails
- **THEN** the system returns an error without marking the order as paid and preserves the order as `pending`

### Requirement: Checkout session must be server-authoritative
The system SHALL create Stripe Checkout sessions from backend-resolved product configuration instead of trusting client-provided pricing.

#### Scenario: Buyer starts checkout
- **WHEN** the frontend requests a checkout session for the book
- **THEN** the backend resolves the active book configuration and uses its own price and currency values to create the Stripe session

#### Scenario: Unsupported or inactive product is requested
- **WHEN** the request references a product that is unknown or inactive in backend configuration
- **THEN** the system rejects checkout initiation and does not create an order or Stripe session

### Requirement: Thank-you page must be informational only
The system SHALL provide a post-checkout confirmation page that does not mutate payment state.

#### Scenario: Buyer returns from Stripe
- **WHEN** Stripe redirects the buyer to the thank-you page after checkout
- **THEN** the page informs the buyer that payment confirmation is being validated and does not mark any order as paid

### Requirement: Payment confirmation must rely on a verified Stripe webhook
The system SHALL update an order to `paid` only after receiving and validating a supported Stripe webhook event.

#### Scenario: Valid checkout completion webhook
- **WHEN** the system receives a signed `checkout.session.completed` event with valid metadata for an existing order
- **THEN** the matching order is updated from `pending` to `paid`

#### Scenario: Invalid webhook signature
- **WHEN** the webhook signature cannot be verified
- **THEN** the system rejects the request and does not mutate any order

### Requirement: Paid orders must persist fulfillment data
The system SHALL store the customer and delivery details required by the distributor as part of the paid order record.

#### Scenario: Webhook contains customer and shipping details
- **WHEN** a verified payment completion event is processed
- **THEN** the system persists customer identity, email, phone when available, shipping address fields, Stripe references, amount total, currency, and payment timestamp in Neon before sending notifications

#### Scenario: Amount or currency does not match expectations
- **WHEN** Stripe reports a total or currency that differs from the backend order values
- **THEN** the system does not automatically mark the order as paid and records the event as an operational anomaly for review

### Requirement: Distributor notification must follow successful persistence
The system SHALL send a transactional email to the distributor only after the paid order has been stored successfully.

#### Scenario: Paid order is stored successfully
- **WHEN** a verified webhook updates the order to `paid` and persists the full operational payload
- **THEN** the system sends a Resend email to the distributor with the order number, buyer details, shipping details, product summary, amount paid, and payment references needed for manual fulfillment

#### Scenario: Email delivery fails after persistence
- **WHEN** the order has already been persisted as `paid` but the distributor email fails
- **THEN** the system keeps the order as paid and records the notification failure without rolling back the order state

### Requirement: Webhook processing must be idempotent
The system SHALL avoid duplicating paid transitions or distributor notifications when Stripe retries delivery.

#### Scenario: Duplicate completion event arrives
- **WHEN** the system receives the same successful payment outcome for an order that is already marked `paid`
- **THEN** the webhook returns success without creating a duplicate paid transition or sending a second distributor email
