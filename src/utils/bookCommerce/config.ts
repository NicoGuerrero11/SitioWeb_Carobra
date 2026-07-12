import type { BookCommerceEnv, BookProductConfig } from "./types";

const DEFAULT_BOOK_PRODUCT: BookProductConfig = {
  slug: "nunca-digas-no-tengo-dinero",
  title: 'Nunca Digas: "No Tengo Dinero"',
  unitAmount: 39900,
  currency: "mxn",
  active: true,
  maxQuantity: 1,
};

class MissingEnvError extends Error {
  constructor(envName: string) {
    super(`Missing required environment variable: ${envName}`);
    this.name = "MissingEnvError";
  }
}

function getOptionalEnv(name: string): string | undefined {
  const value = import.meta.env[name];

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function getRequiredEnv(name: string, fallbackName?: string): string {
  const directValue = getOptionalEnv(name);

  if (directValue) {
    return directValue;
  }

  if (fallbackName) {
    const fallbackValue = getOptionalEnv(fallbackName);

    if (fallbackValue) {
      return fallbackValue;
    }
  }

  throw new MissingEnvError(fallbackName ? `${name} or ${fallbackName}` : name);
}

function parsePositiveInteger(rawValue: string | undefined, fallbackValue: number): number {
  if (!rawValue) {
    return fallbackValue;
  }

  const parsedValue = Number.parseInt(rawValue, 10);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return fallbackValue;
  }

  return parsedValue;
}

function parseBoolean(rawValue: string | undefined, fallbackValue: boolean): boolean {
  if (!rawValue) {
    return fallbackValue;
  }

  return rawValue.toLowerCase() === "true";
}

export function getBookProductConfig(): BookProductConfig {
  return {
    slug: getOptionalEnv("BOOK_PRODUCT_SLUG") ?? DEFAULT_BOOK_PRODUCT.slug,
    title: getOptionalEnv("BOOK_PRODUCT_TITLE") ?? DEFAULT_BOOK_PRODUCT.title,
    unitAmount: parsePositiveInteger(
      getOptionalEnv("BOOK_PRODUCT_UNIT_AMOUNT"),
      DEFAULT_BOOK_PRODUCT.unitAmount,
    ),
    currency: (getOptionalEnv("BOOK_PRODUCT_CURRENCY") ?? DEFAULT_BOOK_PRODUCT.currency).toLowerCase(),
    active: parseBoolean(getOptionalEnv("BOOK_PRODUCT_ACTIVE"), DEFAULT_BOOK_PRODUCT.active),
    maxQuantity: parsePositiveInteger(
      getOptionalEnv("BOOK_PRODUCT_QUANTITY_MAX"),
      DEFAULT_BOOK_PRODUCT.maxQuantity,
    ),
  };
}

export function getBookCommerceEnv(): BookCommerceEnv {
  return {
    databaseUrl: getDatabaseUrl(),
    stripeSecretKey: getStripeSecretKey(),
    stripeWebhookSecret: getStripeWebhookSecret(),
    resendApiKey: "",
    resendFromEmail: getEmailFromAddress(),
    distributorEmail: getBookDistributorEmail(),
    allowedShippingCountries: getAllowedShippingCountries(),
    orderPrefix: getBookOrderPrefix(),
  };
}

export function getRequestOrigin(requestUrl: string): string {
  return new URL(requestUrl).origin;
}

export function getDatabaseUrl(): string {
  return getRequiredEnv("DATABASE_URL", "NEON_DATABASE_URL");
}

export function getStripeSecretKey(): string {
  return getRequiredEnv("STRIPE_SECRET_KEY");
}

export function getStripeWebhookSecret(): string {
  return getRequiredEnv("STRIPE_WEBHOOK_SECRET");
}

export function getBookDistributorEmail(): string {
  return getRequiredEnv("BOOK_DISTRIBUTOR_EMAIL");
}

export function getBookOrderPrefix(): string {
  return getOptionalEnv("BOOK_ORDER_PREFIX") ?? "BOOK";
}

export function getAllowedShippingCountries(): string[] {
  const configuredCountries =
    getOptionalEnv("BOOK_ALLOWED_SHIPPING_COUNTRIES")
      ?.split(",")
      .map((country) => country.trim().toUpperCase())
      .filter(Boolean) ?? [];

  return configuredCountries.length > 0 ? configuredCountries : ["MX"];
}

export function getEmailHost(): string {
  return getRequiredEnv("EMAIL_HOST");
}

export function getEmailPort(): number {
  return parsePositiveInteger(getRequiredEnv("EMAIL_PORT"), 587);
}

export function getEmailUser(): string {
  return getRequiredEnv("EMAIL_USER");
}

export function getEmailPassword(): string {
  return getRequiredEnv("EMAIL_PASSWORD");
}

export function getEmailFromAddress(): string {
  return getRequiredEnv("EMAIL_FROM", "EMAIL_USER");
}
