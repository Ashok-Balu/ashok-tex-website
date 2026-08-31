import express from 'express';
import { saveEnquiry } from '../db/repositories/enquiryRepo.js';
import { sanitizeString, validateEmail, validatePhone, validateName, validateMessage } from '../utils/validator.js';
import { sendEnquiryNotification } from '../utils/email.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, company, email, phone, country, category, categoryId, product, productId, quantity, unit, purpose, requirements, sourcePage } = req.body;

    // Validation
    const cleanName = sanitizeString(name);
    const cleanEmail = sanitizeString(email);
    const cleanPhone = sanitizeString(phone);
    const cleanCategory = sanitizeString(category);
    const cleanRequirements = sanitizeString(requirements);

    if (!validateName(cleanName)) {
      return res.status(400).json({ success: false, message: 'Full Name is required (at least 2 characters).' });
    }
    if (!validateEmail(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'A valid email address is required.' });
    }
    if (!validatePhone(cleanPhone)) {
      return res.status(400).json({ success: false, message: 'A valid phone/WhatsApp number is required.' });
    }
    if (!cleanCategory) {
      return res.status(400).json({ success: false, message: 'Fabric category is required.' });
    }
    if (!validateMessage(cleanRequirements, 10)) {
      return res.status(400).json({ success: false, message: 'Project requirements must be at least 10 characters.' });
    }

    const newEnquiry = await saveEnquiry({
      name: cleanName,
      company: sanitizeString(company),
      email: cleanEmail,
      phone: cleanPhone,
      country: sanitizeString(country),
      category: cleanCategory,
      categoryId: categoryId || null,
      product: sanitizeString(product),
      productId: productId || null,
      quantity: quantity ? Number(quantity) : null,
      unit: sanitizeString(unit) || 'Meter',
      purpose: sanitizeString(purpose),
      requirements: cleanRequirements,
      sourcePage: sanitizeString(sourcePage) || '/request-quote',
    });

    // Notify administrator
    sendEnquiryNotification({ ...newEnquiry, createdAt: newEnquiry.created_at, sourcePage: newEnquiry.source_page }).catch(() => {});

    return res.status(201).json({
      success: true,
      message: 'Thank you. Your enquiry has been received. Our team will contact you shortly.',
      enquiryId: newEnquiry.id,
    });
  } catch (err) {
    console.error('Server enquiry error:', err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again or contact us directly.',
    });
  }
});

export default router;