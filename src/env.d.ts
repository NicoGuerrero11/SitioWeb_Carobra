interface ImportMetaEnv {
  readonly STRIPE_SECRET_KEY?: string;
  readonly STRIPE_WEBHOOK_SECRET?: string;
  readonly DATABASE_URL?: string;
  readonly NEON_DATABASE_URL?: string;
  readonly EMAIL_HOST?: string;
  readonly EMAIL_PORT?: string;
  readonly EMAIL_USER?: string;
  readonly EMAIL_PASSWORD?: string;
  readonly EMAIL_FROM?: string;
  readonly BOOK_DISTRIBUTOR_EMAIL?: string;
  readonly BOOK_ALLOWED_SHIPPING_COUNTRIES?: string;
  readonly BOOK_PRODUCT_SLUG?: string;
  readonly BOOK_PRODUCT_TITLE?: string;
  readonly BOOK_PRODUCT_UNIT_AMOUNT?: string;
  readonly BOOK_PRODUCT_CURRENCY?: string;
  readonly BOOK_PRODUCT_ACTIVE?: string;
  readonly BOOK_PRODUCT_QUANTITY_MAX?: string;
  readonly BOOK_ORDER_PREFIX?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
