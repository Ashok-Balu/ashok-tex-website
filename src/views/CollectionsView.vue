<template>
  <div class="pt-20 pb-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="relative isolate mb-14 overflow-hidden rounded-[2rem] border border-[#e8dccb] bg-gradient-to-br from-[#f7ead8] via-[#fffdf8] to-[#e7eee4] px-6 py-8 text-ink-900 shadow-float sm:px-10 sm:py-12">
        <div class="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-brand-300/30"></div>
        <div class="absolute -bottom-28 right-24 h-56 w-56 rounded-full border border-amber-300/25"></div>
        <div class="relative z-10">
          <Breadcrumb :items="[{ name: 'Collections' }]" class="[&_a]:text-ink-500 [&_a:hover]:text-brand-700 [&_span]:text-ink-900" />
          <div class="mt-8 max-w-3xl">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a5b2d]">Curated fabric catalogue</p>
            <h1 class="mt-3 font-display text-4xl font-bold leading-tight text-ink-950 sm:text-6xl">Materials with a point of view.</h1>
            <p class="mt-4 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg">Explore pure cottons, dimensional woven structures, and sustainable recycled textiles made for considered commercial production.</p>
          </div>
          <div class="mt-8 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-600">
            <span class="rounded-full border border-brand-200 bg-white/75 px-3 py-2">{{ categories.length }} collections</span>
            <span class="rounded-full border border-brand-200 bg-white/75 px-3 py-2">Karur, Tamil Nadu</span>
            <span class="rounded-full border border-brand-200 bg-white/75 px-3 py-2">Manufacturer</span>
            <span class="rounded-full border border-[#c8d8c7] bg-[#e8f0e5] px-3 py-2 text-[#41634b]">Direct supply</span>
          </div>
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
              {{ col.productCount }} {{ col.productCount === 1 ? 'Product' : 'Products' }}
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

