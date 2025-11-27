import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

// Función para enviar email
async function sendEmail(formData: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) {
  // Configurar transporter de nodemailer
  const transporter = nodemailer.createTransport({
    host: import.meta.env.EMAIL_HOST,
    port: parseInt(import.meta.env.EMAIL_PORT || '587'),
    secure: false, // true para port 465, false para otros puertos
    auth: {
      user: import.meta.env.EMAIL_USER,
      pass: import.meta.env.EMAIL_PASSWORD,
    },
  });

  // Crear cuerpo del email en HTML
  const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1f2937; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f3f4f6; padding: 20px; margin: 20px 0; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1f2937; }
        .value { margin-top: 5px; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nuevo Mensaje de Contacto - Carobra</h1>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Nombre:</div>
            <div class="value">${formData.firstName} ${formData.lastName}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${formData.email}</div>
          </div>
          <div class="field">
            <div class="label">Mensaje:</div>
            <div class="value">${formData.message}</div>
          </div>
        </div>
        <div class="footer">
          <p>Este email fue generado automáticamente desde el formulario de contacto de Carobra.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Enviar email
  await transporter.sendMail({
    from: import.meta.env.EMAIL_FROM || import.meta.env.EMAIL_USER,
    to: import.meta.env.EMAIL_TO,
    subject: `Contacto: ${formData.firstName} ${formData.lastName}`,
    html: emailBody,
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Obtener FormData del request
    const formData = await request.formData();
    
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Validar campos requeridos
    if (!firstName || !lastName || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Todos los campos son requeridos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Enviar email
    await sendEmail({ firstName, lastName, email, message });

    return new Response(
      JSON.stringify({ success: true, message: 'Mensaje enviado exitosamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error procesando formulario:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error al procesar la solicitud',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
