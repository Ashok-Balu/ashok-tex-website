<template>
  <section v-if="related && related.length" class="py-16 bg-surface-50 border-t border-surface-200" aria-labelledby="related-heading">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-10">
        <div>
          <p class="section-label">Recommended</p>
          <h2 id="related-heading" class="font-display text-2xl sm:text-3xl font-bold text-ink-900">You May Also Explore</h2>
        </div>
        <router-link to="/products" class="text-sm font-semibold text-brand-600 hover:text-brand-700 hidden sm:flex items-center gap-1.5 transition-colors">
          All Products <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </router-link>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <ProductCard v-for="p in related" :key="p.id" :product="p" />
      </div>
    </div>
  </section>
</template>

<script setup>
import ProductCard from './ProductCard.vue';

defineProps({ related: { type: Array, default: () => [] } });
</script>

