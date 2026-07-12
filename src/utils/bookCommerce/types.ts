export type BookOrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "fulfilled"
  | "cancelled"
  | "refunded";

export interface BookProductConfig {
  slug: string;
  title: string;
  unitAmount: number;
  currency: string;
  active: boolean;
  maxQuantity: number;
}

export interface BookCommerceEnv {
  databaseUrl: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  resendApiKey: string;
  resendFromEmail: string;
  distributorEmail: string;
  allowedShippingCountries: string[];
  orderPrefix: string;
}

export interface BookOrderRecord {
  id: string;
  publicOrderNumber: string;
  status: BookOrderStatus;
  bookSlug: string;
  bookTitle: string;
  unitAmount: number;
  quantity: number;
  currency: string;
  amountTotal: number;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  shippingLine1: string | null;
  shippingLine2: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingPostalCode: string | null;
  shippingCountry: string | null;
  shippingReference: string | null;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  stripeCustomerId: string | null;
  stripeLastEventId: string | null;
  paidAt: string | null;
  fulfilledAt: string | null;
  distributorNotifiedAt: string | null;
  distributorNotificationError: string | null;
  notesInternal: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePendingOrderInput {
  product: BookProductConfig;
  quantity: number;
}

export interface PaidOrderUpdate {
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
  stripeCustomerId: string | null;
  stripeLastEventId: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  shippingLine1: string | null;
  shippingLine2: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingPostalCode: string | null;
  shippingCountry: string | null;
  shippingReference: string | null;
  amountTotal: number;
  currency: string;
  paidAt: string;
}
