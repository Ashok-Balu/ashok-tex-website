<template>
  <article class="group flex h-full flex-col overflow-hidden rounded-[1.65rem] border border-[#f2e4d2] bg-white shadow-[0_15px_35px_-18px_rgba(33,19,8,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_55px_-20px_rgba(30,18,8,0.32)]">
    <div class="relative aspect-[4/3] overflow-hidden bg-[#f5f1eb]">
      <router-link :to="`/products/${product.slug}`" class="block h-full w-full">
        <img
          :src="imageUrl"
          :alt="product.name"
          class="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#1f160f]/50 via-[#1f160f]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span class="rounded-full bg-white/95 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2f211b] shadow-lg">View Details</span>
        </div>
      </router-link>

      <router-link
        v-if="product.categorySlug"
        :to="`/collections/${product.categorySlug}`"
        class="absolute left-3 top-3 rounded-full border border-[#f0e6d8] bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#513b2b] shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
      >
        {{ product.category }}
      </router-link>
      <span v-else class="absolute left-3 top-3 rounded-full border border-[#f0e6d8] bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#513b2b] shadow-sm backdrop-blur-sm">
        {{ product.category }}
      </span>

      <span v-if="product.featured" class="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm">
        <svg class="h-3 w-3 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        Featured
      </span>
    </div>

    <div class="flex flex-grow flex-col p-5">
      <p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8b7a6c]">Machine-Made · Karur</p>
      <h3 class="mb-2 font-display text-[1.4rem] font-semibold leading-snug text-[#1a140f] transition-colors group-hover:text-brand-600">
        <router-link :to="`/products/${product.slug}`">{{ product.name }}</router-link>
      </h3>
      <p class="mb-5 line-clamp-2 text-sm leading-relaxed text-[#665a51]">{{ product.tagline }}</p>

      <div class="mt-auto flex gap-2.5">
        <router-link
          :to="`/products/${product.slug}`"
          class="flex-1 rounded-xl border border-[#eadbc5] bg-[#fffaf6] px-3 py-2.5 text-center text-sm font-medium text-[#3c2d22] transition-all hover:border-[#d9b27c] hover:bg-[#fff4e7]"
        >
          View Details
        </router-link>
        <router-link
          :to="`/request-quote?product=${encodeURIComponent(product.name)}&category=${encodeURIComponent(product.category)}`"
          class="flex-1 rounded-xl bg-brand-500 px-3 py-2.5 text-center text-sm font-semibold text-white shadow-[0_12px_18px_-10px_rgba(232,130,12,0.75)] transition-all hover:bg-brand-600"
        >
          Get Quote
        </router-link>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { optimizeImageUrl } from '../services/api';

const props = defineProps({ product: { type: Object, required: true } });
const imageUrl = computed(() => optimizeImageUrl(props.product.images?.[0], { width: 900 }));
</script>
