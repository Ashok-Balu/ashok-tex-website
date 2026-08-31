<template>
  <div class="pt-20 pb-16 bg-white">

    <!-- Hero -->
    <div class="bg-gradient-to-br from-ink-950 to-ink-800 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb :items="[{ name: 'Request a Quote' }]" class="mb-8 [&_a]:text-white/60 [&_a:hover]:text-white [&_span]:text-white" />
        <div class="max-w-2xl">
          <p class="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-4">B2B Inquiry</p>
          <h1 class="font-display text-4xl sm:text-5xl font-bold text-white mb-3">Request a Quote</h1>
          <p class="text-white/70 text-base leading-relaxed">Get direct mill pricing from Karur. Fill in your project details and our team will respond within 24 hours.</p>
        </div>
      </div>
    </div>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <QuoteForm />

      <div class="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div v-for="item in quickLinks" :key="item.label" class="flex items-start gap-3 p-5 bg-surface-50 rounded-2xl border border-surface-200">
          <div class="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"/></svg>
          </div>
          <div class="min-w-0">
            <p class="text-xs text-ink-500 font-medium uppercase tracking-wide mb-0.5">{{ item.label }}</p>
            <p class="text-sm font-semibold text-ink-900 break-words" v-html="item.value"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import QuoteForm from '../components/QuoteForm.vue';
import { useCompany } from '../composables/useCompany';

const { company } = useCompany();

const quickLinks = computed(() => [
  { label: 'WhatsApp', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', value: `<a href="${company.value?.whatsappUrl || 'https://wa.me/917904154775'}" target="_blank" class="text-brand-600">${company.value?.phone || ''}</a>` },
  { label: 'Email', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', value: `<a href="mailto:${company.value?.email || ''}" class="text-brand-600">${company.value?.email || ''}</a>` },
  { label: 'Location', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', value: `${company.value?.address?.city || ''}, ${company.value?.address?.state || ''} \u2013 ${company.value?.address?.pincode || ''}` },
]);
</script>