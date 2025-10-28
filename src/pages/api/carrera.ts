import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { PDFDocument } from 'pdf-lib';
import { put } from '@vercel/blob';

// Función para convertir archivo a PDF si no lo es
async function convertToPDF(file: File): Promise<Buffer> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type;

  // Si ya es PDF, retornar el buffer directamente
  if (mimeType === 'application/pdf') {
    return buffer;
  }

  // Para archivos DOC/DOCX, necesitarías una librería adicional como 'docx-pdf'
  // Por ahora, esta implementación básica solo maneja PDFs
  // Si quieres convertir DOC/DOCX, considera usar una API externa o librería adicional
  if (mimeType === 'application/msword' || 
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    throw new Error('Conversión de DOC/DOCX a PDF requiere configuración adicional. Por favor, sube un archivo PDF.');
  }

  // Si es otro tipo de archivo, intentar crear un PDF básico con el contenido
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  page.drawText(`Archivo adjunto: ${file.name}`, { x: 50, y: 500, size: 12 });
  
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// Función para subir archivo a Vercel Blob (opcional)
async function uploadToBlob(pdfBuffer: Buffer, fileName: string): Promise<string | null> {
  try {
    if (!import.meta.env.BLOB_READ_WRITE_TOKEN) {
      console.log('BLOB_READ_WRITE_TOKEN no configurado, saltando upload a Vercel Blob');
      return null;
    }

    const blob = await put(`cv/${Date.now()}-${fileName}`, pdfBuffer, {
      access: 'public',
      token: import.meta.env.BLOB_READ_WRITE_TOKEN,
    });

    return blob.url;
  } catch (error) {
    console.error('Error subiendo a Vercel Blob:', error);
    return null;
  }
}

// Función para enviar email
async function sendEmail(
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
  },
  pdfBuffer: Buffer,
  fileName: string,
  blobUrl: string | null
) {
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
          <h1>Nueva Aplicación de Carrera - Carobra</h1>
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
            <div class="label">Teléfono:</div>
            <div class="value">${formData.phone}</div>
          </div>
          ${formData.message ? `
          <div class="field">
            <div class="label">Mensaje:</div>
            <div class="value">${formData.message}</div>
          </div>
          ` : ''}
          ${blobUrl ? `
          <div class="field">
            <div class="label">Link de respaldo del CV:</div>
            <div class="value"><a href="${blobUrl}">Descargar CV</a></div>
          </div>
          ` : ''}
        </div>
        <div class="footer">
          <p>Este email fue generado automáticamente desde el formulario de carreras de Carobra.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Enviar email con el PDF adjunto
  await transporter.sendMail({
    from: import.meta.env.EMAIL_FROM || import.meta.env.EMAIL_USER,
    to: import.meta.env.EMAIL_TO,
    subject: `Nueva Aplicación: ${formData.firstName} ${formData.lastName}`,
    html: emailBody,
    attachments: [
      {
        filename: fileName,
        content: pdfBuffer,
        contentType: 'application/pdf',
        contentDisposition: 'inline', // Permite abrir directamente desde Gmail/Outlook
      },
    ],
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Obtener FormData del request
    const formData = await request.formData();
    
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = (formData.get('message') as string) || '';
    const cvFile = formData.get('cv') as File;

    // Validar campos requeridos
    if (!firstName || !lastName || !email || !phone || !cvFile) {
      return new Response(
        JSON.stringify({ error: 'Todos los campos requeridos deben ser completados' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Convertir archivo a PDF si es necesario
    let pdfBuffer: Buffer;
    let fileName = cvFile.name;

    try {
      pdfBuffer = await convertToPDF(cvFile);
      // Si se convirtió, cambiar la extensión a .pdf
      if (!fileName.toLowerCase().endsWith('.pdf')) {
        fileName = fileName.replace(/\.[^/.]+$/, '') + '.pdf';
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error instanceof Error ? error.message : 'Error al procesar el archivo' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Subir a Vercel Blob (opcional)
    const blobUrl = await uploadToBlob(pdfBuffer, fileName);

    // Enviar email
    await sendEmail(
      { firstName, lastName, email, phone, message },
      pdfBuffer,
      fileName,
      blobUrl
    );

    return new Response(
      JSON.stringify({ success: true, message: 'Aplicación enviada exitosamente' }),
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
