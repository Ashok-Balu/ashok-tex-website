import { collection } from './mongoHelpers.js';
function genId(prefix) { return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`; }
export async function saveEnquiry(data) {
  const enquiry = { id: genId('ENQ'), name: data.name || '', company: data.company || '', email: data.email || '', phone: data.phone || '', country: data.country || '', product: data.product || '', product_id: data.productId || null, category: data.category || '', category_id: data.categoryId || null, quantity: data.quantity ?? null, unit: data.unit || 'Meter', purpose: data.purpose || '', requirements: data.requirements || '', attachment: data.attachment || '', source_page: data.sourcePage || '/request-quote', status: 'New', created_at: new Date() };
  await (await collection('enquiries')).insertOne(enquiry); return enquiry;
}
export async function getEnquiries({ status } = {}) { return (await collection('enquiries')).find(status ? { status } : {}).sort({ created_at: -1 }).toArray(); }
export async function getEnquiryById(id) { return (await collection('enquiries')).findOne({ id }); }
export async function updateEnquiryStatus(id, status) { if (!['New', 'Contacted', 'Quoted', 'Follow-up', 'Closed'].includes(status)) return null; await (await collection('enquiries')).updateOne({ id }, { $set: { status } }); return getEnquiryById(id); }
export async function deleteEnquiry(id) { await (await collection('enquiries')).deleteOne({ id }); return { success: true }; }
export async function saveContactMessage(data) { const message = { id: genId('MSG'), name: data.name || '', email: data.email || '', phone: data.phone || '', message: data.message || '', status: 'New', created_at: new Date() }; await (await collection('contacts')).insertOne(message); return message; }
export async function getContacts() { return (await collection('contacts')).find().sort({ created_at: -1 }).toArray(); }
export async function updateContactStatus(id, status) { if (!['New', 'Read', 'Replied'].includes(status)) return null; await (await collection('contacts')).updateOne({ id }, { $set: { status } }); return (await collection('contacts')).findOne({ id }); }
export async function deleteContact(id) { await (await collection('contacts')).deleteOne({ id }); return { success: true }; }
