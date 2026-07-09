import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { getBookOrderPrefix, getDatabaseUrl } from "./config";
import type {
  BookOrderRecord,
  BookOrderStatus,
  CreatePendingOrderInput,
  PaidOrderUpdate,
} from "./types";

const ORDER_TABLE_NAME = "book_orders";
let schemaReadyPromise: Promise<void> | null = null;

function getSqlClient() {
  return neon(getDatabaseUrl());
}

async function ensureSchema() {
  if (!schemaReadyPromise) {
    schemaReadyPromise = (async () => {
      const sql = getSqlClient();

      await sql(`
        CREATE TABLE IF NOT EXISTS ${ORDER_TABLE_NAME} (
          id TEXT PRIMARY KEY,
          public_order_number TEXT UNIQUE NOT NULL,
          status TEXT NOT NULL,
          book_slug TEXT NOT NULL,
          book_title TEXT NOT NULL,
          unit_amount INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          currency TEXT NOT NULL,
          amount_total INTEGER NOT NULL,
          customer_name TEXT,
          customer_email TEXT,
          customer_phone TEXT,
          shipping_line_1 TEXT,
          shipping_line_2 TEXT,
          shipping_city TEXT,
          shipping_state TEXT,
          shipping_postal_code TEXT,
          shipping_country TEXT,
          shipping_reference TEXT,
          stripe_checkout_session_id TEXT UNIQUE,
          stripe_payment_intent_id TEXT UNIQUE,
          stripe_customer_id TEXT,
          stripe_last_event_id TEXT,
          paid_at TIMESTAMPTZ,
          fulfilled_at TIMESTAMPTZ,
          distributor_notified_at TIMESTAMPTZ,
          distributor_notification_error TEXT,
          notes_internal TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      await sql(`
        CREATE INDEX IF NOT EXISTS book_orders_status_idx
        ON ${ORDER_TABLE_NAME} (status);
      `);
    })();
  }

  return schemaReadyPromise;
}

function buildPublicOrderNumber(prefix: string) {
  const now = new Date();
  const dateToken = now.toISOString().slice(0, 10).replace(/-/g, "");
  const shortId = randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `${prefix}-${dateToken}-${shortId}`;
}

function mapOrderRow(row: Record<string, unknown>): BookOrderRecord {
  return {
    id: String(row.id),
    publicOrderNumber: String(row.public_order_number),
    status: String(row.status) as BookOrderStatus,
    bookSlug: String(row.book_slug),
    bookTitle: String(row.book_title),
    unitAmount: Number(row.unit_amount),
    quantity: Number(row.quantity),
    currency: String(row.currency),
    amountTotal: Number(row.amount_total),
    customerName: row.customer_name ? String(row.customer_name) : null,
    customerEmail: row.customer_email ? String(row.customer_email) : null,
    customerPhone: row.customer_phone ? String(row.customer_phone) : null,
    shippingLine1: row.shipping_line_1 ? String(row.shipping_line_1) : null,
    shippingLine2: row.shipping_line_2 ? String(row.shipping_line_2) : null,
    shippingCity: row.shipping_city ? String(row.shipping_city) : null,
    shippingState: row.shipping_state ? String(row.shipping_state) : null,
    shippingPostalCode: row.shipping_postal_code ? String(row.shipping_postal_code) : null,
    shippingCountry: row.shipping_country ? String(row.shipping_country) : null,
    shippingReference: row.shipping_reference ? String(row.shipping_reference) : null,
    stripeCheckoutSessionId: row.stripe_checkout_session_id ? String(row.stripe_checkout_session_id) : null,
    stripePaymentIntentId: row.stripe_payment_intent_id ? String(row.stripe_payment_intent_id) : null,
    stripeCustomerId: row.stripe_customer_id ? String(row.stripe_customer_id) : null,
    stripeLastEventId: row.stripe_last_event_id ? String(row.stripe_last_event_id) : null,
    paidAt: row.paid_at ? String(row.paid_at) : null,
    fulfilledAt: row.fulfilled_at ? String(row.fulfilled_at) : null,
    distributorNotifiedAt: row.distributor_notified_at ? String(row.distributor_notified_at) : null,
    distributorNotificationError: row.distributor_notification_error
      ? String(row.distributor_notification_error)
      : null,
    notesInternal: row.notes_internal ? String(row.notes_internal) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function normalizeNote(existingNotes: string | null, note: string) {
  const noteLine = `[${new Date().toISOString()}] ${note}`;
  return existingNotes ? `${existingNotes}\n${noteLine}` : noteLine;
}

export async function createPendingOrder(input: CreatePendingOrderInput): Promise<BookOrderRecord> {
  await ensureSchema();

  const sql = getSqlClient();
  const orderId = randomUUID();
  const publicOrderNumber = buildPublicOrderNumber(getBookOrderPrefix());
  const amountTotal = input.product.unitAmount * input.quantity;
  const rows = await sql`
    INSERT INTO book_orders (
      id,
      public_order_number,
      status,
      book_slug,
      book_title,
      unit_amount,
      quantity,
      currency,
      amount_total
    )
    VALUES (
      ${orderId},
      ${publicOrderNumber},
      'pending',
      ${input.product.slug},
      ${input.product.title},
      ${input.product.unitAmount},
      ${input.quantity},
      ${input.product.currency},
      ${amountTotal}
    )
    RETURNING *;
  `;

  return mapOrderRow(rows[0]);
}

export async function getOrderById(orderId: string): Promise<BookOrderRecord | null> {
  await ensureSchema();

  const sql = getSqlClient();
  const rows = await sql`SELECT * FROM book_orders WHERE id = ${orderId} LIMIT 1;`;
  return rows[0] ? mapOrderRow(rows[0]) : null;
}

export async function attachCheckoutSessionId(orderId: string, checkoutSessionId: string) {
  await ensureSchema();

  const sql = getSqlClient();
  await sql`
    UPDATE book_orders
    SET stripe_checkout_session_id = ${checkoutSessionId},
        updated_at = NOW()
    WHERE id = ${orderId};
  `;
}

export async function appendOrderNote(orderId: string, note: string) {
  const order = await getOrderById(orderId);

  if (!order) {
    return;
  }

  const sql = getSqlClient();
  const notesInternal = normalizeNote(order.notesInternal, note);
  await sql`
    UPDATE book_orders
    SET notes_internal = ${notesInternal},
        updated_at = NOW()
    WHERE id = ${orderId};
  `;
}

export async function markOrderPaid(orderId: string, update: PaidOrderUpdate): Promise<BookOrderRecord> {
  await ensureSchema();

  const sql = getSqlClient();
  const rows = await sql`
    UPDATE book_orders
    SET status = 'paid',
        customer_name = ${update.customerName},
        customer_email = ${update.customerEmail},
        customer_phone = ${update.customerPhone},
        shipping_line_1 = ${update.shippingLine1},
        shipping_line_2 = ${update.shippingLine2},
        shipping_city = ${update.shippingCity},
        shipping_state = ${update.shippingState},
        shipping_postal_code = ${update.shippingPostalCode},
        shipping_country = ${update.shippingCountry},
        shipping_reference = ${update.shippingReference},
        stripe_checkout_session_id = ${update.stripeCheckoutSessionId},
        stripe_payment_intent_id = ${update.stripePaymentIntentId},
        stripe_customer_id = ${update.stripeCustomerId},
        stripe_last_event_id = ${update.stripeLastEventId},
        amount_total = ${update.amountTotal},
        currency = ${update.currency},
        paid_at = ${update.paidAt},
        distributor_notification_error = NULL,
        updated_at = NOW()
    WHERE id = ${orderId}
      AND status = 'pending'
    RETURNING *;
  `;

  if (!rows[0]) {
    throw new Error(`Order ${orderId} is no longer pending.`);
  }

  return mapOrderRow(rows[0]);
}

export async function markDistributorNotified(orderId: string): Promise<void> {
  await ensureSchema();

  const sql = getSqlClient();
  await sql`
    UPDATE book_orders
    SET distributor_notified_at = NOW(),
        distributor_notification_error = NULL,
        updated_at = NOW()
    WHERE id = ${orderId};
  `;
}

export async function recordDistributorNotificationFailure(orderId: string, errorMessage: string): Promise<void> {
  const order = await getOrderById(orderId);

  if (!order) {
    return;
  }

  const sql = getSqlClient();
  const notesInternal = normalizeNote(order.notesInternal, `Distributor email failure: ${errorMessage}`);
  await sql`
    UPDATE book_orders
    SET distributor_notification_error = ${errorMessage},
        notes_internal = ${notesInternal},
        updated_at = NOW()
    WHERE id = ${orderId};
  `;
}
