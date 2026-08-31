<template>
  <div class="pt-20 pb-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Page Hero -->
      <div class="py-12 border-b border-surface-100 mb-10">
        <Breadcrumb :items="[{ name: 'Products' }]" />
        <div class="mt-6 max-w-2xl">
          <p class="section-label">Machine-Made Fabric Catalogue</p>
          <h1 class="font-display text-4xl sm:text-5xl font-bold text-ink-900 mb-3">All Products</h1>
          <p class="text-base text-ink-600 leading-relaxed">Browse our complete range of cotton, woven, and recycled fabrics. Manufactured in Karur with custom order flexibility.</p>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="bg-white border border-surface-200 rounded-2xl shadow-sm mb-8 divide-y divide-surface-100">
        <div class="p-5 flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <SearchBar v-model="searchQuery" class="w-full lg:max-w-sm" />
          <div class="ml-auto flex items-center gap-2 w-full lg:w-auto justify-end">
            <label for="sort-select" class="text-sm text-ink-600 font-medium whitespace-nowrap">Sort:</label>
            <select id="sort-select" v-model="sortBy" class="px-3 py-2 bg-white border border-surface-300 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent">
              <option value="featured">Featured</option>
              <option value="name-asc">Name: A–Z</option>
              <option value="name-desc">Name: Z–A</option>
            </select>
          </div>
        </div>
        <div class="p-5 bg-surface-50/60 rounded-b-2xl">
          <p class="text-xs font-semibold uppercase tracking-widest text-ink-400 mb-3">Category</p>
          <CategoryFilter v-model="selectedCategory" />
        </div>
      </div>

      <!-- Count -->
      <div class="flex items-center justify-between text-sm text-ink-500 mb-6">
        <span v-if="!loading">Showing <strong class="text-ink-800">{{ products.length }}</strong> of {{ pagination.total }} fabrics</span>
        <button v-if="searchQuery || selectedCategory !== 'All'" class="text-sm text-brand-600 hover:text-brand-700 font-medium" @click="clearFilters">Clear filters</button>
      </div>

      <!-- Grid -->
      <div v-if="loading" class="text-center py-24 text-ink-400">Loading fabrics&hellip;</div>
      <div v-else-if="products.length > 0">
        <ProductGrid :products="products" />
        <div v-if="pagination.totalPages > 1" class="flex items-center justify-center gap-2 mt-10">
          <button
            v-for="p in pagination.totalPages" :key="p"
            :class="['w-9 h-9 rounded-lg text-sm font-medium transition-colors', p === pagination.page ? 'bg-ink-900 text-white' : 'bg-white border border-surface-200 text-ink-600 hover:bg-surface-100']"
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

