import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter = null;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Renders a simple bordered "box" table so every field (including the email address) stays clearly visible in mail clients.
function renderHtmlBox(heading, rows) {
  const rowsHtml = rows
    .filter((r) => r.value !== undefined && r.value !== null && r.value !== '')
    .map((r) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(r.label)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;word-break:break-word;">${r.html ? r.value : escapeHtml(r.value)}</td>
      </tr>`)
    .join('');

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f3f4f6;padding:24px;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <div style="background:#111827;padding:18px 20px;">
        <p style="margin:0;color:#f59e0b;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;">Ashok Tex</p>
        <h2 style="margin:4px 0 0;color:#ffffff;font-size:18px;">${escapeHtml(heading)}</h2>
      </div>
      <table style="width:100%;border-collapse:collapse;">${rowsHtml}</table>
    </div>
  </div>`;
}

export async function sendEnquiryNotification(enquiry) {
  const recipient = process.env.NOTIFICATION_EMAIL || 'arvinthas4@gmail.com';
  const textBody = `
New B2B Fabric Quote Enquiry Received from ashoktex.in:

Enquiry ID: ${enquiry.id}
Date: ${enquiry.createdAt}
Name: ${enquiry.name}
Company: ${enquiry.company || 'N/A'}
Email: ${enquiry.email}
Phone / WhatsApp: ${enquiry.phone}
Category: ${enquiry.category}
Product: ${enquiry.product || 'General'}
Quantity: ${enquiry.quantity || 'N/A'} ${enquiry.unit}
Requirements:
${enquiry.requirements}

Source Page: ${enquiry.sourcePage || '/request-quote'}
Status: NEW
`;

  const htmlBody = renderHtmlBox('New Quote Enquiry', [
    { label: 'Enquiry ID', value: enquiry.id },
    { label: 'Date', value: enquiry.createdAt },
    { label: 'Name', value: enquiry.name },
    { label: 'Company', value: enquiry.company || 'N/A' },
    { label: 'Email', value: enquiry.email ? `<a href="mailto:${escapeHtml(enquiry.email)}" style="color:#c2410c;">${escapeHtml(enquiry.email)}</a>` : 'N/A', html: true },
    { label: 'Phone / WhatsApp', value: enquiry.phone },
    { label: 'Category', value: enquiry.category },
    { label: 'Product', value: enquiry.product || 'General' },
    { label: 'Quantity', value: `${enquiry.quantity || 'N/A'} ${enquiry.unit || ''}`.trim() },
    { label: 'Requirements', value: enquiry.requirements },
    { label: 'Source Page', value: enquiry.sourcePage || '/request-quote' },
  ]);

  console.log('[Ashok Tex Notification] New Quote Request:\n', textBody);

  if (!transporter) {
    console.warn('[Email Not Sent] SMTP_USER/SMTP_PASS are not configured in .env — enquiry was saved but no email was dispatched.');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Ashok Tex Enquiries" <${process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: enquiry.email || undefined,
      subject: `[New Quote Request] ${enquiry.name} - ${enquiry.category} (${enquiry.id})`,
      text: textBody,
      html: htmlBody,
    });
    console.log('[Email Dispatched] to ' + recipient);
  } catch (err) {
    console.error('[Email Dispatch Error]', err.message);
  }
}

export async function sendContactNotification(message) {
  const recipient = process.env.NOTIFICATION_EMAIL || 'arvinthas4@gmail.com';
  const textBody = `
New Contact Message Received from ashoktex.in:

Message ID: ${message.id}
Date: ${message.created_at}
Name: ${message.name}
Email: ${message.email}
Phone: ${message.phone}
Message:
${message.message}
`;

  const htmlBody = renderHtmlBox('New Contact Message', [
    { label: 'Message ID', value: message.id },
    { label: 'Date', value: message.created_at },
    { label: 'Name', value: message.name },
    { label: 'Email', value: message.email ? `<a href="mailto:${escapeHtml(message.email)}" style="color:#c2410c;">${escapeHtml(message.email)}</a>` : 'N/A', html: true },
    { label: 'Phone', value: message.phone },
    { label: 'Message', value: message.message },
  ]);

  console.log('[Ashok Tex Notification] New Contact Message:\n', textBody);

  if (!transporter) {
    console.warn('[Email Not Sent] SMTP_USER/SMTP_PASS are not configured in .env — message was saved but no email was dispatched.');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Ashok Tex Website" <${process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: message.email || undefined,
      subject: `[New Contact Message] ${message.name} (${message.id})`,
      text: textBody,
      html: htmlBody,
    });
    console.log('[Email Dispatched] to ' + recipient);
  } catch (err) {
    console.error('[Email Dispatch Error]', err.message);
  }
}