<template>
  <div class="pt-20 pb-16 bg-white">

    <!-- Hero -->
    <div class="bg-gradient-to-br from-ink-950 to-ink-800 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb :items="[{ name: 'Contact' }]" class="mb-8 [&_a]:text-white/60 [&_a:hover]:text-white [&_span]:text-white" />
        <div class="max-w-2xl">
          <p class="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-4">Direct Mill Communication</p>
          <h1 class="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Contact Ashok Tex</h1>
          <p class="text-white/70 text-base leading-relaxed">Reach our commercial desk in Karur, Tamil Nadu. We welcome sample inquiries, bulk quotes, and custom weave requests.</p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-14">

        <!-- Contact Info -->
        <div class="lg:col-span-5 space-y-6">
          <div class="bg-surface-50 rounded-3xl border border-surface-200 p-8 space-y-6">
            <div>
              <h2 class="font-display text-2xl font-bold text-ink-900">Ashok Tex</h2>
              <p class="text-sm text-brand-600 font-medium mt-0.5">Karur, Tamil Nadu · Est. 1995</p>
            </div>

            <div class="space-y-4 pt-4 border-t border-surface-200">
              <div v-for="item in contactItems" :key="item.label" class="flex items-start gap-3">
                <div class="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"/></svg>
                </div>
                <div class="min-w-0">
                  <p class="text-xs text-ink-500 font-medium uppercase tracking-wide mb-0.5">{{ item.label }}</p>
                  <p class="text-sm text-ink-900 font-medium break-words" v-html="item.content"></p>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-surface-200 flex flex-wrap gap-3">
              <a :href="company?.whatsappUrl || 'https://wa.me/917904154775'" target="_blank" rel="noopener" class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2 shadow-sm">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                WhatsApp
              </a>
              <a :href="`tel:${company?.phoneRaw || '+917904154775'}`" class="px-5 py-2.5 bg-ink-900 hover:bg-ink-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm">Call Now</a>
              <router-link to="/request-quote" class="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-all shadow-sm">Get Quote</router-link>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="lg:col-span-7">
          <ContactForm />
        </div>
      </div>

      <!-- Map -->
      <a
        :href="googleMapsUrl"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Ashok Tex location in Google Maps"
        class="block h-96 lg:h-[30rem] rounded-3xl overflow-hidden shadow-section border border-surface-200 bg-surface-100 cursor-pointer"
      >
        <iframe
          :src="defaultMapUrl"
          width="100%" height="100%" style="border:0; pointer-events:none;" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Ashok Tex Location Map"
        ></iframe>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import ContactForm from '../components/ContactForm.vue';
import { useCompany } from '../composables/useCompany';

const { company } = useCompany();
const googleMapsUrl = 'https://www.google.com/maps/place/Ashok+Tex,+weaving+unit/@10.8439481,78.0353335,17z/data=!4m14!1m7!3m6!1s0x3baa2598ff9b4029:0xe3981d2da7644da1!2sAshok+Tex,+weaving+unit!8m2!3d10.8439428!4d78.0379084!16s%2Fg%2F11sjtjhjx1!3m5!1s0x3baa2598ff9b4029:0xe3981d2da7644da1!8m2!3d10.8439428!4d78.0379084!16s%2Fg%2F11sjtjhjx1?entry=ttu';
const defaultMapUrl = 'https://www.google.com/maps?q=Ashok+Tex,+weaving+unit&ll=10.8439428,78.0379084&z=17&t=k&output=embed';

function formatPhone(value, fallback) {
  const digits = String(value || fallback).replace(/\D/g, '').slice(-10);
  return digits.length === 10 ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` : fallback;
}

const contactItems = computed(() => [
  {
    label: 'Address',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    content: company.value?.address?.full || '',
  },
  {
    label: 'Phone & WhatsApp',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    content: `<span class="block text-brand-600 hover:text-brand-700">Mr. Balusamy: <a href="tel:+919943345614" class="text-brand-600 hover:text-brand-700">+91 99433 45614</a></span><span class="block mt-1 text-brand-600 hover:text-brand-700">Mr. Arvinth: <a href="tel:+917904154775" class="text-brand-600 hover:text-brand-700">+91 79041 54775</a></span>`,
  },
  {
    label: 'Email',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    content: `<a href="mailto:${company.value?.email || ''}" class="text-brand-600 hover:text-brand-700">${company.value?.email || ''}</a>`,
  },
  {
    label: 'GST Registration',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    content: company.value?.gstin || '',
  },
]);
</script>
