import { mailSettings } from '@config/connections';
import nodemailer from 'nodemailer';

/**
 * Función para enviar un correo electrónico
 * @param {string|string[]} to - Dirección o direcciones de correo del destinatario
 * @param {string} subject - Asunto del correo
 * @param {string} htmlContent - Contenido HTML del correo
 * @param {string} [textContent] - Contenido de texto plano del correo (opcional)
 * @param {string} [from] - Dirección de correo del remitente (opcional)
 * @param {Array} [attachments] - Archivos adjuntos (opcional)
 */
export default async function sendMail({
  to,
  subject,
  textContent = '',
  from
}) {
  try {
    const transporter = nodemailer.createTransport(mailSettings);
    const mailOptions = {
      from: from,
      to: Array.isArray(to) ? to.join(', ') : to, // Permite múltiples destinatarios
      subject: subject,
      text: textContent // Contenido de texto plano opcional
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error al enviar el correo: %s', error);
  }
}
