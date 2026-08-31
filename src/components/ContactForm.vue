<template>
  <div class="bg-white rounded-3xl shadow-section border border-surface-200 overflow-hidden">
    <div class="bg-gradient-to-r from-ink-900 to-ink-800 px-8 py-8">
      <h3 class="font-display text-2xl font-bold text-white mb-1">Send a Message</h3>
      <p class="text-white/60 text-sm">Reach out to our sales team in Karur. We respond within 24 hours.</p>
    </div>

    <div class="p-8">
      <div v-if="status === 'success'" class="p-5 bg-green-50 border border-green-200 rounded-2xl mb-6" role="alert">
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </div>
          <div>
            <p class="font-semibold text-green-900">Message sent!</p>
            <p class="text-sm text-green-700 mt-0.5">Mr. Arvinth.B will respond within 24 hours.</p>
            <button type="button" class="mt-2 text-xs font-semibold text-green-800 underline" @click="status = 'idle'">Send another</button>
          </div>
        </div>
      </div>

      <div v-if="status === 'error'" class="p-4 bg-red-50 border border-red-200 rounded-2xl mb-5 text-sm text-red-700">{{ errorMessage || 'Failed. Please call +91 7904154775.' }}</div>

      <form v-if="status !== 'success'" @submit.prevent="handleSubmit" novalidate class="space-y-4">
        <div>
          <label for="contact-name" class="block text-sm font-medium text-ink-700 mb-1.5">Name <span class="text-red-500">*</span></label>
          <input id="contact-name" v-model="form.name" type="text" required placeholder="Your full name" :class="['input-field', errors.name ? 'border-red-400 focus:ring-red-400' : '']" @blur="validateField('name')" />
          <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="contact-email" class="block text-sm font-medium text-ink-700 mb-1.5">Email <span class="text-red-500">*</span></label>
            <input id="contact-email" v-model="form.email" type="email" required placeholder="you@email.com" :class="['input-field', errors.email ? 'border-red-400 focus:ring-red-400' : '']" @blur="validateField('email')" />
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
          </div>
          <div>
            <label for="contact-phone" class="block text-sm font-medium text-ink-700 mb-1.5">Phone <span class="text-red-500">*</span></label>
            <input id="contact-phone" v-model="form.phone" type="tel" inputmode="numeric" maxlength="10" pattern="[0-9]{10}" required placeholder="10-digit phone number" :class="['input-field', errors.phone ? 'border-red-400 focus:ring-red-400' : '']" @input="form.phone = digitsOnly(form.phone)" @blur="validateField('phone')" />
            <p v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>
          </div>
        </div>
        <div>
          <label for="contact-message" class="block text-sm font-medium text-ink-700 mb-1.5">Message <span class="text-red-500">*</span></label>
          <textarea id="contact-message" v-model="form.message" rows="4" required placeholder="How can we assist your business?" :class="['input-field resize-none', errors.message ? 'border-red-400 focus:ring-red-400' : '']" @blur="validateField('message')"></textarea>
          <p v-if="errors.message" class="text-red-500 text-xs mt-1">{{ errors.message }}</p>
        </div>
        <button type="submit" :disabled="status === 'submitting'" class="w-full py-3.5 bg-brand-500 hover:bg-brand-600 disabled:bg-ink-400 text-white font-semibold rounded-xl transition-all shadow-sm text-sm flex items-center justify-center gap-2">
          <svg v-if="status === 'submitting'" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
          {{ status === 'submitting' ? 'Sending...' : 'Send Message' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { digitsOnly } from '../utils/phone';

const form = reactive({ name: '', email: '', phone: '', message: '' });
const errors = reactive({ name: '', email: '', phone: '', message: '' });
const status = ref('idle');
const errorMessage = ref('');

const validateField = (field) => {
  if (field === 'name') errors.name = !form.name.trim() ? 'Name is required' : (form.name.trim().length < 2 ? 'Name is too short' : '');
  if (field === 'email') errors.email = !form.email.trim() ? 'Email is required' : (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? 'Enter a valid email address' : '');
  if (field === 'phone') errors.phone = !form.phone ? 'Phone is required' : (!/^\d{10}$/.test(form.phone) ? 'Enter exactly 10 digits' : '');
  if (field === 'message') errors.message = !form.message.trim() ? 'Message is required' : (form.message.trim().length < 10 ? 'Message must be at least 10 characters' : '');
};

const validate = () => {
  ['name', 'email', 'phone', 'message'].forEach(validateField);
  return !errors.name && !errors.email && !errors.phone && !errors.message;
};

const handleSubmit = async () => {
  if (!validate()) return;

  status.value = 'submitting';
  errorMessage.value = '';
  try {
    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.message || 'Failed to send message.');
    status.value = 'success';
    Object.assign(form, { name: '', email: '', phone: '', message: '' });
  } catch (err) {
    status.value = 'error';
    errorMessage.value = err.message || 'Failed. Please call +91 7904154775.';
  }
};
</script>
