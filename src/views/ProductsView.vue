<template>
  <div class="page-shell pt-20 pb-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="product-spotlight relative overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10 mb-8">
        <div class="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border border-brand-200/60 bg-brand-100/30 blur-sm"></div>
        <div class="pointer-events-none absolute bottom-0 right-24 h-px w-40 bg-gradient-to-r from-transparent via-brand-400/60 to-transparent"></div>
        <Breadcrumb :items="[{ name: 'Products' }]" />
        <div class="relative mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div class="max-w-3xl">
            <span class="luxury-chip">Machine-Made Fabric Catalogue</span>
            <h1 class="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">All Products</h1>
            <p class="mt-4 max-w-2xl text-base text-ink-600 leading-relaxed">Browse our complete range of cotton, woven, and recycled fabrics. Manufactured in Karur with custom order flexibility and bulk-ready consistency.</p>
          </div>
          <div class="rounded-[1.5rem] border border-[#efd9b0] bg-white/80 p-4 shadow-[0_18px_35px_-25px_rgba(107,63,26,0.55)] backdrop-blur-sm">
            <div class="grid grid-cols-3 gap-3 text-center">
              <div class="detail-stat rounded-xl border-[#f3e5d0]">
                <p class="text-xl font-bold text-ink-900">8+</p>
                <p class="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink-500">Collections</p>
              </div>
              <div class="detail-stat rounded-xl border-[#f3e5d0]">
                <p class="text-xl font-bold text-ink-900">24</p>
                <p class="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink-500">Per Page</p>
              </div>
              <div class="detail-stat rounded-xl border-[#f3e5d0]">
                <p class="text-xl font-bold text-ink-900">100%</p>
                <p class="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink-500">Quality Focus</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="premium-panel mb-8 overflow-hidden rounded-[1.6rem] border-[#ecdcc4] shadow-[0_18px_40px_-30px_rgba(82,48,22,0.65)]">
        <div class="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div class="w-full lg:max-w-md">
            <SearchBar v-model="searchQuery" class="w-full" />
          </div>
          <div class="flex items-center gap-2 self-end lg:self-auto">
            <label for="sort-select" class="whitespace-nowrap text-sm font-medium text-ink-600">Sort:</label>
            <select id="sort-select" v-model="sortBy" class="rounded-xl border border-surface-300 bg-white px-3 py-2.5 text-sm text-ink-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent">
              <option value="featured">Featured</option>
              <option value="name-asc">Name: A–Z</option>
              <option value="name-desc">Name: Z–A</option>
            </select>
          </div>
        </div>
        <div class="border-t border-[#f3e8d5] bg-[#fffaf4] p-5">
          <p class="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-500">Category</p>
          <CategoryFilter v-model="selectedCategory" />
        </div>
      </div>

      <div class="mb-6 flex items-center justify-between gap-4 text-sm text-ink-500">
        <span v-if="!loading">Showing <strong class="text-ink-800">{{ products.length }}</strong> of {{ pagination.total }} fabrics</span>
        <button v-if="searchQuery || selectedCategory !== 'All'" class="font-medium text-brand-600 transition-colors hover:text-brand-700" @click="clearFilters">Clear filters</button>
      </div>

      <div v-if="loading" class="rounded-[1.75rem] border border-[#f1e7d4] bg-white py-24 text-center text-ink-400 shadow-sm">Loading fabrics&hellip;</div>
      <div v-else-if="products.length > 0">
        <ProductGrid :products="products" />
        <div v-if="pagination.totalPages > 1" class="mt-10 flex items-center justify-center gap-2">
          <button
            v-for="p in pagination.totalPages" :key="p"
            :class="['h-10 w-10 rounded-xl text-sm font-medium transition-all', p === pagination.page ? 'bg-ink-900 text-white shadow-lg shadow-slate-900/10' : 'border border-surface-200 bg-white text-ink-600 hover:bg-surface-100']"
            @click="page = p"
          >{{ p }}</button>
        </div>
      </div>
      <EmptyState v-else title="No Products Found" :message="`No fabrics match '${searchQuery || selectedCategory}'. Try clearing filters.`" action-text="Clear Filters" @action="clearFilters" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProductList } from '../composables/useProducts';
import Breadcrumb from '../components/Breadcrumb.vue';
import SearchBar from '../components/SearchBar.vue';
import CategoryFilter from '../components/CategoryFilter.vue';
import ProductGrid from '../components/ProductGrid.vue';
import EmptyState from '../components/EmptyState.vue';

const route = useRoute();
const searchQuery = ref('');
// Pre-filter from a deep link like /products?category=cotton (e.g. clicked from Home).
const selectedCategory = ref(route.query.category || 'All');
const sortBy = ref('featured');
const page = ref(1);

const sortMap = { featured: 'featured', 'name-asc': 'name-asc', 'name-desc': 'name-desc' };

const queryParams = computed(() => ({
  category: selectedCategory.value !== 'All' ? selectedCategory.value : undefined,
  search: searchQuery.value.trim() || undefined,
  sort: sortMap[sortBy.value],
  page: page.value,
  limit: 24,
}));

const { products, pagination, loading } = useProductList(queryParams);

watch([searchQuery, selectedCategory, sortBy], () => { page.value = 1; });

// Keep in sync if navigated to /products?category=... again while already on this page.
watch(() => route.query.category, (val) => { selectedCategory.value = val || 'All'; });

const clearFilters = () => { searchQuery.value = ''; selectedCategory.value = 'All'; sortBy.value = 'featured'; page.value = 1; };
</script>

