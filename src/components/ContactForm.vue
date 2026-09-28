<template>
  <div class="bg-white rounded-3xl shadow-section border border-surface-200 overflow-hidden">
    <div class="bg-gradient-to-r from-ink-900 to-ink-800 px-8 py-8">
      <h3 class="font-display text-2xl font-bold text-white mb-1">Send a Message</h3>
      <p class="text-white/60 text-sm">Reach out to our sales team in Karur. We respond within 24 hours.</p>
    </div>

    <div class="p-8">
      <div v-if="status === 'success'" class="mb-6 overflow-hidden rounded-[28px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-lime-50 shadow-[0_18px_45px_rgba(16,185,129,0.12)]" role="alert">
        <div class="p-5 sm:p-6">
          <div class="flex items-start gap-3 sm:gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </div>
            <div class="min-w-0 flex-1">
              <div class="mb-2 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Message Sent</div>
              <p class="font-display text-2xl font-bold text-emerald-900">Message sent!</p>
              <p class="mt-2 text-sm leading-6 text-emerald-800 sm:text-[15px]">Mr. Arvinth.B will respond within 24 hours and help with your textile requirement.</p>
            </div>
          </div>

          <div class="mt-5 grid gap-3 sm:grid-cols-2">
            <div class="rounded-2xl border border-emerald-200 bg-white/80 p-3">
              <p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-600">Need instant help?</p>
              <a href="tel:+917904154775" class="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-700">
                <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">☎</span>
                +91 79041 54775
              </a>
            </div>
            <div class="rounded-2xl border border-emerald-200 bg-white/80 p-3">
              <p class="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-600">Quick channel</p>
              <a href="https://wa.me/917904154775?text=Hello%20Ashok%20Tex%2C%20I%20want%20to%20follow%20up%20on%20my%20message." target="_blank" rel="noopener" class="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-700">
                <span class="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✦</span>
                WhatsApp Us
              </a>
            </div>
          </div>

          <button type="button" class="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700" @click="status = 'idle'">
            Send another
          </button>
        </div>
      </div>

      <div v-if="status === 'error'" class="p-4 bg-red-50 border border-red-200 rounded-2xl mb-5 text-sm text-red-700">{{ errorMessage || 'Failed. Please call +91 7904154775.' }}</div>

      <v-form v-if="status !== 'success'" @submit.prevent="handleSubmit" novalidate class="space-y-4">
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
            <input id="contact-phone" v-model="form.phone" type="tel" inputmode="numeric" maxlength="16" pattern="^(\+91\s?)?[6-9]\d{4}\s?\d{5}$" required placeholder="+91 98765 43210" :class="['input-field', errors.phone ? 'border-red-400 focus:ring-red-400' : '']" @input="form.phone = digitsOnly(form.phone)" @blur="validateField('phone')" />
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
      </v-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { digitsOnly, isValidIndianMobilePhone } from '../utils/phone';

const form = reactive({ name: '', email: '', phone: '', message: '' });
const errors = reactive({ name: '', email: '', phone: '', message: '' });
const status = ref('idle');
const errorMessage = ref('');

const validateField = (field) => {
  if (field === 'name') errors.name = !form.name.trim() ? 'Name is required' : (form.name.trim().length < 2 ? 'Name is too short' : '');
  if (field === 'email') errors.email = !form.email.trim() ? 'Email is required' : (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? 'Enter a valid email address' : '');
  if (field === 'phone') errors.phone = !form.phone ? 'Phone is required' : (!isValidIndianMobilePhone(form.phone) ? 'Enter a valid Indian mobile number with +91 if needed' : '');
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
