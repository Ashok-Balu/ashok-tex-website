<template>
  <div class="pt-20 pb-16 bg-white">

    <!-- Hero -->
    <div class="bg-gradient-to-br from-ink-950 to-ink-800 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb :items="[{ name: 'Privacy Policy' }]" class="mb-8 [&_a]:text-white/60 [&_a:hover]:text-white [&_span]:text-white" />
        <div class="max-w-2xl">
          <p class="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-4">Legal &amp; Compliance</p>
          <h1 class="font-display text-4xl sm:text-5xl font-bold text-white mb-3">Privacy Policy</h1>
          <p class="text-white/70 text-base leading-relaxed">How {{ company?.name || 'Ashok Tex' }} collects, uses, and protects information shared by our business partners and website visitors.</p>
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
              <p class="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-2">Questions About This Policy?</p>
              <p class="text-sm text-white/70">Contact Mr. {{ company?.contactPerson?.replace(/^Mr\.?\s*/i, '') || 'our team' }} at
                <a :href="`mailto:${company?.email || ''}`" class="text-white underline hover:text-brand-300">{{ company?.email || '' }}</a>
              </p>
            </div>
            <router-link to="/contact" class="px-5 py-3 bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold rounded-xl transition-all shrink-0">Contact Us →</router-link>
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
    id: 'information-we-collect',
    title: 'Information We Collect',
    body: `<p>When you submit a quotation enquiry, contact request, or newsletter sign-up, we collect the details you provide directly, such as your full name, company/brand name, email address, phone/WhatsApp number, fabric specifications, and estimated order quantities.</p>
           <p>We also automatically collect limited technical information — such as browser type, device type, and pages visited — to keep the site secure and to understand how buyers use our catalogue.</p>`,
  },
  {
    id: 'how-we-use-data',
    title: 'How We Use Business Data',
    body: `<p>Information is used exclusively to generate quotations, respond to enquiries, arrange sample dispatch, coordinate bulk orders, and improve our product catalogue. We never use your data for unrelated marketing without consent.</p>`,
  },
  {
    id: 'cookies',
    title: 'Cookies &amp; Similar Technologies',
    body: `<p>Our website may use essential cookies to remember your preferences (such as filters on the products page) and basic analytics cookies to understand site traffic. No cookies are used for third-party advertising.</p>`,
  },
  {
    id: 'data-sharing',
    title: 'Data Sharing &amp; Security',
    body: `<p>We do not sell, rent, or trade your data to third-party marketing companies. Enquiry and contact data is stored on secure infrastructure and is only accessible to authorized ${company.value?.name || 'Ashok Tex'} staff involved in order fulfillment.</p>`,
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    body: `<p>Enquiry and transaction records are retained for as long as necessary to fulfill orders, meet accounting/GST compliance requirements (GSTIN: ${company.value?.gstin || '—'}), and resolve any disputes, after which they are securely deleted or anonymized.</p>`,
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    body: `<p>You may request access to, correction of, or deletion of your personal data at any time by emailing us at <a href="mailto:${company.value?.email || ''}" class="text-brand-600 underline">${company.value?.email || ''}</a>. We will respond within a reasonable timeframe.</p>`,
  },
  {
    id: 'policy-changes',
    title: 'Changes to This Policy',
    body: `<p>We may update this policy periodically to reflect changes in our practices or legal requirements. The "Last Updated" date above indicates the most recent revision.</p>`,
  },
  {
    id: 'contact',
    title: 'Contact Us',
    body: `<p>Questions regarding this policy can be directed to Mr. ${company.value?.contactPerson?.replace(/^Mr\.?\s*/i, '') || 'our team'} at <a href="mailto:${company.value?.email || ''}" class="text-brand-600 underline">${company.value?.email || ''}</a> or at ${company.value?.address?.full || ''}.</p>`,
  },
]);
</script>
