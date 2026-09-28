<template>
  <div class="page-shell pt-20 pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-5 flex items-center justify-between gap-4">
        <Breadcrumb :items="breadcrumbItems" />
        <button type="button" class="flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700" @click="goBack">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          Back
        </button>
      </div>

      <div v-if="loading" class="rounded-[1.75rem] border border-[#f0e5d7] bg-white py-24 text-center text-ink-400 shadow-sm">Loading fabric details&hellip;</div>

      <div v-else-if="currentProduct" class="space-y-16">
        <div class="detail-panel relative overflow-hidden rounded-[2rem] p-4 shadow-[0_24px_60px_-42px_rgba(73,42,21,0.7)] sm:p-6 lg:p-8">
          <div class="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-400/70 to-transparent"></div>
          <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
            <div class="lg:sticky lg:top-24 lg:col-span-6">
              <ProductGallery :images="currentProduct.images" :alt-text="currentProduct.name" />
            </div>

            <div class="space-y-7 lg:col-span-6">
              <div class="border-b border-[#f0e8de] pb-6">
                <div class="mb-3 flex flex-wrap items-center gap-2">
                  <span v-if="currentProduct.category" class="luxury-chip !tracking-[0.12em] !text-[10px]">{{ currentProduct.category }}</span>
                  <span class="text-xs font-medium uppercase tracking-[0.16em] text-[#86786d]">Karur, Tamil Nadu</span>
                </div>
                <h1 class="mb-4 font-display text-3xl font-bold leading-[1.08] tracking-tight text-[#1c160f] sm:text-4xl lg:text-[2.7rem]">{{ currentProduct.name }}</h1>
                <p class="text-base leading-relaxed text-[#584d46]">{{ currentProduct.description }}</p>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div class="detail-stat rounded-2xl">
                  <p class="text-[10px] uppercase tracking-[0.18em] text-ink-500">Fabric</p>
                  <p class="mt-2 text-sm font-semibold text-ink-800">Premium</p>
                </div>
                <div class="detail-stat rounded-2xl">
                  <p class="text-[10px] uppercase tracking-[0.18em] text-ink-500">Finish</p>
                  <p class="mt-2 text-sm font-semibold text-ink-800">Durable</p>
                </div>
                <div class="detail-stat rounded-2xl">
                  <p class="text-[10px] uppercase tracking-[0.18em] text-ink-500">Supply</p>
                  <p class="mt-2 text-sm font-semibold text-ink-800">Bulk</p>
                </div>
              </div>

              <div v-if="currentProduct.specifications && currentProduct.specifications.length" class="space-y-4">
                <h2 class="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Technical Specifications</h2>
                <div class="overflow-hidden rounded-[1.4rem] border border-[#f1e4d0] bg-[#fffdf9]">
                  <dl class="divide-y divide-[#f1e4d0]">
                    <div v-for="spec in currentProduct.specifications" :key="spec.id" class="flex gap-4 px-5 py-3.5 text-sm">
                      <dt class="w-40 shrink-0 font-medium text-[#705f53]">{{ spec.label }}</dt>
                      <dd class="font-semibold text-[#1b160f]">{{ spec.value }}</dd>
                    </div>
                  </dl>
                </div>
                <div class="flex items-start gap-2.5 rounded-2xl border border-[#f2dcc0] bg-[#fff7ef] p-4 text-sm text-[#7b4d12]">
                  <svg class="mt-0.5 h-4 w-4 shrink-0 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span>Contact us for detailed technical specifications and bulk availability.</span>
                </div>
              </div>

              <div class="space-y-3 rounded-[1.35rem] border border-[#f0dfc8] bg-[#fffaf3] p-4 shadow-[0_16px_30px_-28px_rgba(91,51,18,0.7)]">
                <router-link
                  :to="`/request-quote?product=${encodeURIComponent(currentProduct.name)}&category=${encodeURIComponent(currentProduct.category || '')}`"
                  class="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 px-6 py-4 text-sm font-semibold text-white shadow-[0_16px_20px_-10px_rgba(232,130,12,0.7)] transition-all hover:-translate-y-0.5 hover:bg-brand-600"
                >
                  Request a Quote →
                </router-link>
                <div class="grid grid-cols-2 gap-3">
                  <a :href="whatsappProductUrl" target="_blank" rel="noopener" class="flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-700">
                    <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                    WhatsApp
                  </a>
                  <a href="tel:+917904154775" class="flex items-center justify-center gap-2 rounded-2xl border border-[#e7dccb] bg-white px-4 py-3 text-sm font-semibold text-[#271d18] shadow-sm transition-all hover:bg-[#fffaf6]">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    Call Direct
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <RelatedProducts :related="currentProduct.related" />
      </div>

      <div v-else class="py-24 text-center">
        <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-surface-100">
          <svg class="h-9 w-9 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h2 class="mb-3 font-display text-3xl font-bold text-ink-900">Fabric Not Found</h2>
        <p class="mb-8 text-ink-500">The requested fabric does not exist in our catalog.</p>
        <router-link to="/products" class="btn-primary">Return to All Products</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductDetail } from '../composables/useProducts';
import Breadcrumb from '../components/Breadcrumb.vue';
import ProductGallery from '../components/ProductGallery.vue';
import RelatedProducts from '../components/RelatedProducts.vue';
import { injectStructuredData, getProductSchema } from '../utils/schema';

const route = useRoute();
const router = useRouter();
const slug = computed(() => route.params.slug || route.path.split('/products/')[1]);
const { product: currentProduct, loading } = useProductDetail(slug);

watch(currentProduct, (product) => {
  if (product) injectStructuredData(getProductSchema(product), 'product-json-ld');
}, { immediate: true });

const backLink = computed(() => (currentProduct.value?.categorySlug ? `/collections/${currentProduct.value.categorySlug}` : '/products'));

const formatINR = (n) => Number(n).toLocaleString('en-IN');

// Prefer real browser history (so Back returns to the actual previous page, e.g. a
// filtered products search) and only fall back to the category link when this page
// was opened directly (no in-app history to go back to).
function goBack() {
  if (window.history.state?.back) router.back();
  else router.push(backLink.value);
}

const breadcrumbItems = computed(() => {
  const items = [{ name: 'Products', path: '/products' }];
  const ancestry = currentProduct.value?.breadcrumb || [];
  ancestry.forEach((c) => items.push({ name: c.name, path: `/collections/${c.slug}` }));
  items.push({ name: currentProduct.value ? currentProduct.value.name : 'Details' });
  return items;
});

const whatsappProductUrl = computed(() => {
  if (!currentProduct.value) return 'https://wa.me/917904154775';
  const msg = `Hello Ashok Tex, I am interested in ${currentProduct.value.name}. Please share details and quotation.`;
  return `https://wa.me/917904154775?text=${encodeURIComponent(msg)}`;
});
</script>

