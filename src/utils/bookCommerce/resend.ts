import nodemailer from "nodemailer";
import {
  getBookDistributorEmail,
  getEmailFromAddress,
  getEmailHost,
  getEmailPassword,
  getEmailPort,
  getEmailUser,
} from "./config";
import type { BookOrderRecord } from "./types";

let transporter: nodemailer.Transporter | null = null;

function getBookEmailTransporter() {
  if (!transporter) {
    const port = getEmailPort();

    transporter = nodemailer.createTransport({
      host: getEmailHost(),
      port,
      secure: port === 465,
      auth: {
        user: getEmailUser(),
        pass: getEmailPassword(),
      },
    });
  }

  return transporter;
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function renderOrderDetailLine(label: string, value: string | null) {
  return `
    <tr>
      <td style="padding:8px 0;font-weight:600;color:#103b75;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;color:#334155;">${value ?? "No disponible"}</td>
    </tr>
  `;
}

export async function sendDistributorOrderEmail(order: BookOrderRecord) {
  const mailer = getBookEmailTransporter();
  const totalPaid = formatMoney(order.amountTotal, order.currency);

  const html = `
    <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e2e8f0;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#004E8A;">
          Nueva orden pagada
        </p>
        <h1 style="margin:0 0 16px;font-size:30px;line-height:1.1;color:#0A2342;">
          ${order.publicOrderNumber}
        </h1>
        <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#475569;">
          El pago del libro quedó confirmado. Esta orden ya puede ser tomada por el distribuidor para fulfillment manual.
        </p>

        <table style="width:100%;border-collapse:collapse;">
          ${renderOrderDetailLine("Libro", order.bookTitle)}
          ${renderOrderDetailLine("Monto pagado", totalPaid)}
          ${renderOrderDetailLine("Correo del comprador", order.customerEmail)}
          ${renderOrderDetailLine("Nombre del comprador", order.customerName)}
          ${renderOrderDetailLine("Teléfono", order.customerPhone)}
          ${renderOrderDetailLine("Dirección", order.shippingLine1)}
          ${renderOrderDetailLine("Complemento", order.shippingLine2)}
          ${renderOrderDetailLine("Ciudad", order.shippingCity)}
          ${renderOrderDetailLine("Estado", order.shippingState)}
          ${renderOrderDetailLine("Código postal", order.shippingPostalCode)}
          ${renderOrderDetailLine("País", order.shippingCountry)}
          ${renderOrderDetailLine("Checkout Session", order.stripeCheckoutSessionId)}
          ${renderOrderDetailLine("Payment Intent", order.stripePaymentIntentId)}
          ${renderOrderDetailLine("Pagado en", order.paidAt)}
        </table>
      </div>
    </div>
  `;

  const text = [
    `Nueva orden pagada: ${order.publicOrderNumber}`,
    `Libro: ${order.bookTitle}`,
    `Monto pagado: ${totalPaid}`,
    `Nombre: ${order.customerName ?? "No disponible"}`,
    `Correo: ${order.customerEmail ?? "No disponible"}`,
    `Telefono: ${order.customerPhone ?? "No disponible"}`,
    `Direccion: ${order.shippingLine1 ?? "No disponible"}`,
    `Complemento: ${order.shippingLine2 ?? "No disponible"}`,
    `Ciudad: ${order.shippingCity ?? "No disponible"}`,
    `Estado: ${order.shippingState ?? "No disponible"}`,
    `Codigo postal: ${order.shippingPostalCode ?? "No disponible"}`,
    `Pais: ${order.shippingCountry ?? "No disponible"}`,
    `Checkout Session: ${order.stripeCheckoutSessionId ?? "No disponible"}`,
    `Payment Intent: ${order.stripePaymentIntentId ?? "No disponible"}`,
    `Pagado en: ${order.paidAt ?? "No disponible"}`,
  ].join("\n");

  return mailer.sendMail({
    from: getEmailFromAddress(),
    to: getBookDistributorEmail(),
    subject: `Nueva orden pagada ${order.publicOrderNumber}`,
    html,
    text,
  });
}
