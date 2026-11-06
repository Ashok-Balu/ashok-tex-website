import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import dns from 'node:dns';

dotenv.config({ path: '.env.production' });

const port = Number(process.env.SMTP_PORT) || 587;

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error('SMTP_USER and SMTP_PASS must be configured.');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port,
  secure: process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === 'true'
    : port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS.replace(/\s/g, ''),
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 30000,
  family: 4,
  lookup: (hostname, options, callback) => dns.lookup(hostname, { ...options, family: 4 }, callback),
});

try {
  await transporter.verify();
  console.log('SMTP connection successful.');
} catch (error) {
  console.error(`SMTP connection failed: ${error.message}`);
  process.exit(1);
}
