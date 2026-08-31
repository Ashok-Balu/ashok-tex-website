<template>
  <div class="pt-20 pb-16 bg-white">

    <!-- Hero -->
    <div class="bg-gradient-to-br from-ink-950 to-ink-800 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb :items="[{ name: 'Terms of Supply' }]" class="mb-8 [&_a]:text-white/60 [&_a:hover]:text-white [&_span]:text-white" />
        <div class="max-w-2xl">
          <p class="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-4">Commercial Conditions</p>
          <h1 class="font-display text-4xl sm:text-5xl font-bold text-white mb-3">Terms of Supply &amp; Service</h1>
          <p class="text-white/70 text-base leading-relaxed">The commercial terms governing B2B transactions, quotations, and fabric supply agreements with {{ company?.name || 'Ashok Tex' }}, {{ company?.address?.city || 'Karur' }}, {{ company?.address?.state || 'Tamil Nadu' }}.</p>
          <p class="text-xs text-white/40 mt-6">Last Updated: {{ lastUpdated }}</p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-10">

        <!-- Table of Contents -->
        <aside class="lg:col-span-1">
          <nav class="lg:sticky lg:top-24 bg-surface-50 border border-surface-200 rounded-2xl p-5" aria-label="Table of contents">
            <p class="text-xs font-semibold uppercase tracking-widest text-ink-500 mb-3">On this page</p>
            <ol class="space-y-2 text-sm">
              <li v-for="(s, i) in sections" :key="s.id">
                <a :href="`#${s.id}`" class="flex gap-2 text-ink-600 hover:text-brand-600 transition-colors">
                  <span class="text-ink-400 tabular-nums">{{ String(i + 1).padStart(2, '0') }}</span>
                  <span>{{ s.title }}</span>
                </a>
              </li>
            </ol>
          </nav>
        </aside>

        <!-- Content -->
        <div class="lg:col-span-3 space-y-6">
          <div
            v-for="(s, i) in sections" :key="s.id" :id="s.id"
            class="bg-white rounded-2xl border border-surface-200 p-6 sm:p-8 scroll-mt-24"
          >
            <div class="flex items-start gap-4 mb-4">
              <span class="w-9 h-9 shrink-0 rounded-xl bg-brand-50 text-brand-700 font-display font-bold flex items-center justify-center text-sm">{{ i + 1 }}</span>
              <h2 class="font-display text-xl sm:text-2xl font-bold text-ink-900 pt-1">{{ s.title }}</h2>
            </div>
            <div class="text-sm text-ink-600 leading-relaxed space-y-3 sm:pl-[52px]" v-html="s.body"></div>
          </div>

          <!-- Contact card -->
          <div class="bg-ink-950 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p class="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-2">Have Questions on an Order?</p>
              <p class="text-sm text-white/70">Reach Mr. {{ company?.contactPerson?.replace(/^Mr\.?\s*/i, '') || 'our team' }} at
                <a :href="`mailto:${company?.email || ''}`" class="text-white underline hover:text-brand-300">{{ company?.email || '' }}</a>
              </p>
            </div>
            <router-link to="/request-quote" class="px-5 py-3 bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold rounded-xl transition-all shrink-0">Request a Quote →</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import { useCompany } from '../composables/useCompany';

const { company } = useCompany();

const lastUpdated = 'January 2026';

const sections = computed(() => [
  {
    id: 'quotations-pricing',
    title: 'Quotations &amp; Pricing',
    body: `<p>All quotations shared via WhatsApp, email, or our website are commercial estimates, subject to raw yarn market fluctuations, applicable GST (GSTIN: ${company.value?.gstin || '—'}), and any custom finishes requested. Final pricing is confirmed only via a formal proforma invoice.</p>`,
  },
  {
    id: 'moq',
    title: 'Minimum Order Quantities (MOQ)',
    body: `<p>Standard customized powerloom weaving runs typically require a minimum of ${company.value?.moq || '2,500 meters'} per design/colourway. Sample swatches are available on request prior to bulk confirmation.</p>`,
  },
  {
    id: 'manufacturing-tolerances',
    title: 'Manufacturing &amp; Tolerances',
    body: `<p>Standard industry tolerances (±3% for GSM, width, and piece length) apply to all bulk production runs. Custom-dyed lots are matched against approved master swatches within standard commercial delta values; minor shade variance between lots is normal for reactive/vat dyeing processes.</p>`,
  },
  {
    id: 'payment-terms',
    title: 'Payment Terms',
    body: `<p>Unless otherwise agreed in writing, orders are confirmed against an advance payment, with the balance payable prior to dispatch or as per the terms stated on the proforma invoice. Bank details are shared only through verified company channels.</p>`,
  },
  {
    id: 'shipping-delivery',
    title: 'Shipping &amp; Delivery',
    body: `<p>Dispatch timelines are communicated at order confirmation and depend on fabric availability and production load. We ship pan-India via trusted transport partners; freight and insurance terms are agreed per order.</p>`,
  },
  {
    id: 'returns-claims',
    title: 'Returns &amp; Quality Claims',
    body: `<p>Any quality discrepancy must be reported in writing within 7 days of delivery with supporting photos/samples. Claims outside approved tolerance bands will be assessed and resolved through replacement, credit note, or partial refund at our discretion.</p>`,
  },
  {
    id: 'jurisdiction',
    title: 'Governing Law &amp; Jurisdiction',
    body: `<p>All commercial transactions with ${company.value?.name || 'Ashok Tex'} are governed by applicable Indian law and are subject to the exclusive jurisdiction of the competent courts in ${company.value?.address?.city || 'Karur'}, ${company.value?.address?.state || 'Tamil Nadu'}, India.</p>`,
  },
  {
    id: 'changes',
    title: 'Changes to These Terms',
    body: `<p>We may revise these terms periodically to reflect updated business practices. The "Last Updated" date above indicates the most recent revision; continued orders after changes constitute acceptance.</p>`,
  },
]);
</script>
