<template>
  <div class="group bg-white rounded-2xl shadow-card border border-surface-200 overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col">

    <!-- Image -->
    <div class="relative aspect-[4/3] overflow-hidden bg-surface-100">
      <router-link :to="`/products/${product.slug}`" class="block w-full h-full">
        <img
          :src="product.images?.[0]?.url || product.images?.[0] || ''"
          :alt="product.name"
          class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-ink-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span class="px-4 py-2 bg-white text-ink-900 text-xs font-semibold rounded-xl shadow-lg">View Details</span>
        </div>
      </router-link>
      <router-link
        v-if="product.categorySlug"
        :to="`/collections/${product.categorySlug}`"
        class="absolute top-3 left-3 px-2.5 py-1 bg-white/95 hover:bg-white backdrop-blur-sm text-ink-900 text-[11px] font-semibold rounded-lg shadow-sm border border-surface-200 transition-colors"
      >
        {{ product.category }}
      </router-link>
      <span v-else class="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-ink-900 text-[11px] font-semibold rounded-lg shadow-sm border border-surface-200">
        {{ product.category }}
      </span>
      <span v-if="product.featured" class="absolute top-3 right-3 px-2.5 py-1 bg-brand-500 text-white text-[11px] font-semibold rounded-lg shadow-sm flex items-center gap-1">
        <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        Featured
      </span>
    </div>

    <!-- Content -->
    <div class="p-5 flex flex-col flex-grow">
      <p class="text-[11px] text-ink-400 font-medium uppercase tracking-wider mb-1.5">Machine-Made · Karur, Tamil Nadu</p>
      <h3 class="font-display text-lg font-semibold text-ink-900 leading-snug mb-2 group-hover:text-brand-600 transition-colors">
        <router-link :to="`/products/${product.slug}`">{{ product.name }}</router-link>
      </h3>
      <p class="text-sm text-ink-500 line-clamp-2 leading-relaxed mb-4">{{ product.tagline }}</p>

      <!-- Actions -->
      <div class="flex gap-2 mt-auto">
        <router-link
          :to="`/products/${product.slug}`"
          class="flex-1 py-2 text-center text-sm font-medium text-ink-700 hover:text-ink-900 hover:bg-surface-50 rounded-lg transition-all border border-surface-200"
        >
          View Details
        </router-link>
        <router-link
          :to="`/request-quote?product=${encodeURIComponent(product.name)}&category=${encodeURIComponent(product.category)}`"
          class="flex-1 py-2 text-center text-sm font-semibold bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-all shadow-sm"
        >
          Get Quote
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ product: { type: Object, required: true } });
</script>
