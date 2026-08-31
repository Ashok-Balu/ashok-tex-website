<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
        <div>
          <p class="section-label">{{ subtitle || 'Curated Machine-Made Fabrics' }}</p>
          <h2 class="section-title">{{ title || 'Featured Fabrics' }}</h2>
        </div>
        <router-link to="/products" class="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1.5 transition-colors group shrink-0">
          View all products
          <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </router-link>
      </div>
      <ProductGrid :products="featuredList" />
    </div>
  </section>
</template>

<script setup>
import { useFeaturedProducts } from '../composables/useProducts';
import ProductGrid from './ProductGrid.vue';

defineProps({ title: { type: String, default: '' }, subtitle: { type: String, default: '' } });

const { products: featuredList } = useFeaturedProducts(6);
</script>
