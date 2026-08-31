import express from 'express';
import { getPublishedTestimonials } from '../db/repositories/testimonialRepo.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const testimonials = (await getPublishedTestimonials()).map((t) => ({
    id: t.id,
    customerName: t.customer_name,
    role: t.role,
    quote: t.quote,
    image: t.image,
    rating: t.rating,
  }));
  res.json({ success: true, data: testimonials });
});

export default router;
