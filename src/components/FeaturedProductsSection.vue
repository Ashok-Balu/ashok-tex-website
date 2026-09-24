<template>
  <section class="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(232,130,12,0.08),_transparent_32rem),linear-gradient(180deg,#fffdfb_0%,#fffaf4_100%)] py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="section-label">{{ subtitle || 'Curated Machine-Made Fabrics' }}</p>
          <h2 class="section-title">{{ title || 'Featured Fabrics' }}</h2>
        </div>
        <router-link to="/products" class="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 shrink-0">
          View all products
          <svg class="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </router-link>
      </div>

      <div class="rounded-[2rem] border border-[#f1e3c5] bg-white/70 p-4 shadow-[0_20px_50px_-30px_rgba(48,31,18,0.25)] backdrop-blur-sm sm:p-6">
        <ProductGrid :products="featuredList" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useFeaturedProducts } from '../composables/useProducts';
import ProductGrid from './ProductGrid.vue';

defineProps({ title: { type: String, default: '' }, subtitle: { type: String, default: '' } });

const { products: featuredList } = useFeaturedProducts(6);
</script>
