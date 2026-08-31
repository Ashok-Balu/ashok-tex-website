<template>
  <div class="pt-20 pb-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Breadcrumb -->
      <div class="py-5 flex items-center justify-between">
        <Breadcrumb :items="breadcrumbItems" />
        <button type="button" class="text-sm text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1 transition-colors" @click="goBack">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          Back
        </button>
      </div>

      <div v-if="loading" class="text-center py-24 text-ink-400">Loading fabric details&hellip;</div>

      <div v-else-if="currentProduct" class="space-y-16">
        <!-- Main Product Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          <!-- Gallery -->
          <div class="lg:col-span-6 lg:sticky lg:top-24">
            <ProductGallery :images="currentProduct.images" :alt-text="currentProduct.name" />
          </div>

          <!-- Details -->
          <div class="lg:col-span-6 space-y-7">

            <!-- Header -->
            <div class="border-b border-surface-200 pb-6">
              <div class="flex flex-wrap items-center gap-2 mb-3">
                <span v-if="currentProduct.category" class="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-xl border border-brand-100">{{ currentProduct.category }}</span>
                <span class="text-xs text-ink-500">Karur, Tamil Nadu</span>
              </div>
              <h1 class="font-display text-3xl sm:text-4xl font-bold text-ink-900 leading-tight mb-3">{{ currentProduct.name }}</h1>
              <p class="text-base text-ink-600 leading-relaxed">{{ currentProduct.description }}</p>
            </div>

            <!-- Specs -->
            <div v-if="currentProduct.specifications && currentProduct.specifications.length">
              <h2 class="text-xs font-semibold uppercase tracking-widest text-ink-500 mb-4">Technical Specifications</h2>
              <div class="bg-surface-50 rounded-2xl border border-surface-200 overflow-hidden">
                <dl class="divide-y divide-surface-100">
                  <div v-for="spec in currentProduct.specifications" :key="spec.id" class="px-5 py-3.5 flex gap-4 text-sm">
                    <dt class="text-ink-500 font-medium w-44 shrink-0">{{ spec.label }}</dt>
                    <dd class="text-ink-900 font-semibold">{{ spec.value }}</dd>
                  </div>
                </dl>
              </div>
              <div class="mt-3 p-4 bg-brand-50 rounded-xl border border-brand-100 flex items-start gap-2.5 text-sm text-brand-800">
                <svg class="w-4 h-4 text-brand-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Contact us for detailed technical specifications and bulk availability.</span>
              </div>
            </div>

            <!-- CTAs -->
            <div class="space-y-3 pt-2 border-t border-surface-100">
              <router-link
                :to="`/request-quote?product=${encodeURIComponent(currentProduct.name)}&category=${encodeURIComponent(currentProduct.category || '')}`"
                class="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                Request a Quote →
              </router-link>
              <div class="grid grid-cols-2 gap-3">
                <a :href="whatsappProductUrl" target="_blank" rel="noopener" class="py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  WhatsApp
                </a>
                <a href="tel:+917904154775" class="py-3 bg-white hover:bg-surface-50 text-ink-900 text-sm font-semibold rounded-xl transition-all border border-surface-300 flex items-center justify-center gap-2 shadow-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  Call Direct
                </a>
              </div>
            </div>
          </div>
        </div>

        <RelatedProducts :related="currentProduct.related" />
      </div>

      <!-- Not Found -->
      <div v-else class="text-center py-24">
        <div class="w-20 h-20 bg-surface-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg class="w-9 h-9 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h2 class="font-display text-3xl font-bold text-ink-900 mb-3">Fabric Not Found</h2>
        <p class="text-ink-500 mb-8">The requested fabric does not exist in our catalog.</p>
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

