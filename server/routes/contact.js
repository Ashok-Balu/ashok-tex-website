import express from 'express';
import { saveContactMessage } from '../db/repositories/enquiryRepo.js';
import { sanitizeString, validateEmail, validatePhone, validateName, validateMessage } from '../utils/validator.js';
import { sendContactNotification } from '../utils/email.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const cleanName = sanitizeString(name);
    const cleanEmail = sanitizeString(email);
    const cleanPhone = sanitizeString(phone);
    const cleanMessage = sanitizeString(message);

    if (!validateName(cleanName)) {
      return res.status(400).json({ success: false, message: 'Please enter your full name (at least 2 characters).' });
    }
    if (!validateEmail(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'A valid email address is required.' });
    }
    if (!validatePhone(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'A valid phone number is required.' });
    }
    if (!validateMessage(cleanMessage, 10)) {
      return res.status(400).json({ success: false, message: 'Message must be at least 10 characters.' });
    }

    const saved = await saveContactMessage({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: cleanMessage,
    });

    sendContactNotification(saved).catch(() => {});

    return res.status(201).json({
      success: true,
      message: 'Thank you. Your message has been sent successfully.',
      id: saved.id,
    });
  } catch (err) {
    console.error('Contact error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process message.' });
  }
});

export default router;