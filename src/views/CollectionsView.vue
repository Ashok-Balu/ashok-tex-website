<template>
  <div class="pt-20 pb-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="py-12 border-b border-surface-100 mb-12">
        <Breadcrumb :items="[{ name: 'Collections' }]" />
        <div class="mt-6 max-w-2xl">
          <p class="section-label">Curated Fabric Catalogue</p>
          <h1 class="font-display text-4xl sm:text-5xl font-bold text-ink-900 mb-3">Our Fabric Collections</h1>
          <p class="text-base text-ink-600 leading-relaxed">Explore our core fabric classifications: pure cottons, dimensional woven structures, and sustainable recycled textiles.</p>
        </div>
      </div>

      <!-- Collections -->
      <div v-if="categories.length === 0" class="text-center py-16 text-ink-400">Loading collections&hellip;</div>
      <div v-else class="space-y-10 mb-16">
        <div
          v-for="(col, index) in categories"
          :key="col.id"
          class="bg-white rounded-3xl border border-surface-200 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 grid grid-cols-1 lg:grid-cols-2 items-stretch"
        >
          <!-- Image -->
          <div :class="['aspect-[4/3] lg:aspect-auto overflow-hidden bg-surface-100', index % 2 === 1 ? 'lg:order-2' : '']">
            <img :src="col.image" :alt="col.name" class="w-full h-full object-cover" loading="lazy" />
          </div>

          <!-- Content -->
          <div :class="['p-8 sm:p-12 flex flex-col justify-center space-y-5', index % 2 === 1 ? 'lg:order-1' : '']">
            <span
              class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
              :style="{ backgroundColor: `${col.accentColor || '#1a6b3a'}22`, color: col.accentColor || '#1a6b3a' }"
            >
              {{ col.productCount }} Fabrics
            </span>
            <h2 class="font-display text-3xl sm:text-4xl font-bold text-ink-900">{{ col.name }}</h2>
            <p class="text-base text-ink-600 leading-relaxed">{{ col.description }}</p>
            <div class="flex flex-wrap gap-3 pt-2">
              <router-link :to="`/collections/${col.slug}`" class="btn-primary">
                View {{ col.name }} Products →
              </router-link>
              <router-link :to="`/request-quote?category=${encodeURIComponent(col.name)}`" class="btn-secondary">
                Quote {{ col.name }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useCategoryFlat } from '../composables/useCategories';
import Breadcrumb from '../components/Breadcrumb.vue';

const { flat: categories } = useCategoryFlat();
</script>

