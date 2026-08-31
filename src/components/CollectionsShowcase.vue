<template>
  <section class="py-20 bg-surface-50" aria-labelledby="collections-heading">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
        <div>
          <p class="section-label">{{ subtitle || 'Fabric Catalogue' }}</p>
          <h2 id="collections-heading" class="section-title">{{ title || 'Our Collections' }}</h2>
        </div>
        <router-link to="/collections" class="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1.5 transition-colors group shrink-0">
          View all collections
          <svg class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <router-link
          v-for="col in categories.slice(0, 6)"
          :key="col.id"
          :to="`/products?category=${col.slug}`"
          class="group relative overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-400 block"
        >
          <div class="aspect-[3/4] overflow-hidden">
            <img
              :src="col.image"
              :alt="col.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600 ease-out"
              loading="lazy"
            />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent"></div>

          <div class="absolute top-4 left-4">
            <span class="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-ink-800 text-xs font-semibold rounded-xl">
              {{ col.productCount }} Products
            </span>
          </div>

          <div class="absolute bottom-6 left-6 right-6 text-white">
            <h3 class="font-display text-2xl font-bold mb-1.5 group-hover:text-brand-300 transition-colors">{{ col.name }}</h3>
            <p class="text-sm text-white/70 line-clamp-2 leading-relaxed mb-4">{{ col.description }}</p>
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-300 group-hover:text-white transition-colors">
              Explore Range
              <svg class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useCategoryFlat } from '../composables/useCategories';

defineProps({ title: { type: String, default: '' }, subtitle: { type: String, default: '' } });

const { flat: categories } = useCategoryFlat();
</script>

