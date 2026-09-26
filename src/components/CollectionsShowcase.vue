<template>
  <section class="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(232,130,12,0.08),_transparent_28rem),linear-gradient(180deg,#fff9f2_0%,#fffefb_100%)] py-20" aria-labelledby="collections-heading">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="section-label">{{ subtitle || 'Fabric Catalogue' }}</p>
          <h2 id="collections-heading" class="section-title">{{ title || 'Our Collections' }}</h2>
        </div>
        <router-link to="/collections" class="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 shrink-0">
          View all collections
          <svg class="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </router-link>
      </div>

      <div class="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
        <router-link
          v-for="col in categories.slice(0, 6)"
          :key="col.id"
          :to="`/products?category=${col.slug}`"
          class="group relative block overflow-hidden rounded-[1.8rem] border border-[#f0dfc2] bg-white shadow-[0_20px_50px_-28px_rgba(48,31,18,0.3)] transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_30px_70px_-30px_rgba(48,31,18,0.35)]"
        >
          <div class="aspect-[3/4] overflow-hidden">
            <img
              :src="optimizeImageUrl(col.image, { width: 900 })"
              :alt="col.name"
              class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-[#1a120d]/85 via-[#1a120d]/20 to-transparent"></div>

          <div class="absolute left-4 top-4">
            <span class="rounded-full border border-white/40 bg-white/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#40312e] backdrop-blur-sm">
              {{ col.productCount }} Products
            </span>
          </div>

          <div class="absolute inset-x-0 bottom-0 p-3 text-white sm:p-6">
            <h3 class="mb-2 font-display text-lg font-bold leading-tight text-white transition-colors group-hover:text-brand-300 sm:text-2xl sm:leading-normal">{{ col.name }}</h3>
            <p class="mb-3 line-clamp-2 text-xs leading-relaxed text-white/75 sm:mb-4 sm:text-sm">{{ col.description }}</p>
            <span class="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-300 transition-colors group-hover:text-white sm:text-xs">
              Explore Range
              <svg class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useCategoryFlat } from '../composables/useCategories';
import { optimizeImageUrl } from '../services/api';

defineProps({ title: { type: String, default: '' }, subtitle: { type: String, default: '' } });

const { flat: categories } = useCategoryFlat();
</script>

