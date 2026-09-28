<template>
  <footer class="bg-[#040d17] text-white" aria-labelledby="footer-heading">
    <h2 id="footer-heading" class="sr-only">Site Footer</h2>

    <div class="bg-[linear-gradient(135deg,_#e8820c_0%,_#d67606_100%)]">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row lg:px-8">
        <div>
          <p class="font-display text-2xl font-bold text-white">Ready to source quality fabrics?</p>
          <p class="mt-1 text-sm text-white/80">Contact us for bulk pricing and sample requests.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <router-link to="/request-quote" class="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-sm transition-all hover:bg-brand-50">Request a Quote</router-link>
          <a :href="whatsappUrl" target="_blank" rel="noopener" class="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700">
            <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            WhatsApp Us
          </a>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
        <div class="space-y-5 lg:col-span-2">
          <router-link to="/" class="inline-block">
            <span class="font-display text-2xl font-bold text-white">Ashok Tex</span>
            <span class="mt-0.5 block text-xs font-medium tracking-[0.18em] text-brand-400">Karur, Tamil Nadu · Est. 1995</span>
          </router-link>
          <p class="max-w-sm text-sm leading-relaxed text-ink-300">Premier B2B manufacturer and wholesale supplier of quality textile fabrics — operating from the textile capital of India.</p>
          <div class="space-y-2 text-xs text-ink-400">
            <p><span class="font-medium text-ink-300">GST:</span> {{ company?.gstin || '—' }}</p>
            <p><span class="font-medium text-ink-300">Founder:</span> Mr. {{ company?.founder?.replace(/^Mr\.?\s*/i, '') || '—' }}</p>
            <p><span class="font-medium text-ink-300">Contact:</span> Mr. {{ company?.contactPerson?.replace(/^Mr\.?\s*/i, '') || '—' }}</p>
          </div>
          <div class="flex gap-3 pt-1">
            <a :href="whatsappUrl" target="_blank" rel="noopener" class="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-800 transition-colors hover:bg-green-600" aria-label="WhatsApp"><svg class="h-4 w-4 fill-current text-white" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg></a>
            <a :href="`mailto:${company?.email || ''}`" class="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-800 transition-colors hover:bg-brand-600" aria-label="Email"><svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></a>
            <a :href="phoneHref" class="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-800 transition-colors hover:bg-brand-600" aria-label="Phone"><svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg></a>
          </div>
        </div>

        <div>
          <h3 class="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Collections</h3>
          <ul class="space-y-2.5 text-sm">
            <li v-for="cat in topCategories" :key="cat.slug"><router-link :to="`/collections/${cat.slug}`" class="text-ink-300 transition-colors hover:text-white">{{ cat.name }}</router-link></li>
            <li class="pt-1"><router-link to="/collections" class="text-xs font-semibold text-brand-400 transition-colors hover:text-brand-300">All Collections →</router-link></li>
          </ul>
        </div>

        <div>
          <h3 class="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Products</h3>
          <ul class="space-y-2.5 text-sm">
            <li v-for="p in footerProducts" :key="p.slug"><router-link :to="`/products/${p.slug}`" class="text-ink-300 transition-colors hover:text-white">{{ p.name }}</router-link></li>
            <li class="pt-1"><router-link to="/products" class="text-xs font-semibold text-brand-400 transition-colors hover:text-brand-300">All Products →</router-link></li>
          </ul>
        </div>

        <div>
          <h3 class="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">Company</h3>
          <ul class="space-y-2.5 text-sm">
            <li><router-link to="/about" class="text-ink-300 transition-colors hover:text-white">About Us</router-link></li>
            <li><router-link to="/why-ashok-tex" class="text-ink-300 transition-colors hover:text-white">Why Ashok Tex</router-link></li>
            <li><router-link to="/testimonials" class="text-ink-300 transition-colors hover:text-white">Testimonials</router-link></li>
            <li><router-link to="/contact" class="text-ink-300 transition-colors hover:text-white">Contact Us</router-link></li>
            <li><router-link to="/request-quote" class="text-ink-300 transition-colors hover:text-white">Request Quote</router-link></li>
            <li class="mt-2 border-t border-ink-800 pt-2"><router-link to="/privacy-policy" class="text-xs text-ink-500 transition-colors hover:text-ink-300">Privacy Policy</router-link></li>
            <li><router-link to="/terms" class="text-xs text-ink-500 transition-colors hover:text-ink-300">Terms of Supply</router-link></li>
          </ul>
        </div>
      </div>

      <div class="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ink-800 pt-6 text-xs text-ink-500 sm:flex-row">
        <p>{{ company?.address?.full || '' }}</p>
        <p class="shrink-0">&copy; {{ new Date().getFullYear() }} {{ company?.name || 'Ashok Tex' }}. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import { useCompany } from '../composables/useCompany';
import { useCategoryFlat } from '../composables/useCategories';
import { useProductList } from '../composables/useProducts';
import { buildWhatsAppUrl } from '../utils/phone';

const { company } = useCompany();
const { flat: categories } = useCategoryFlat();
const { products } = useProductList({ limit: 4, sort: 'featured' });

const topCategories = computed(() => categories.value.slice(0, 4));
const footerProducts = computed(() => products.value.slice(0, 4));
const whatsappUrl = computed(() => buildWhatsAppUrl(company.value?.whatsappUrl || company.value?.whatsappNumber || '917904154775'));
const phoneHref = computed(() => `tel:${company.value?.phoneRaw || '+917904154775'}`);
</script>