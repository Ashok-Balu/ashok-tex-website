<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
      <h1 class="font-display text-2xl font-bold text-ink-900">Products</h1>
      <router-link to="/admin/products/new" class="w-full sm:w-auto px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl text-center whitespace-nowrap">+ Add Product</router-link>
    </div>

    <div class="flex flex-col sm:flex-row gap-3">
      <input v-model="search" placeholder="Search products…" class="input-field flex-1 text-base" @input="scheduleLoad" />
      <select v-model="statusFilter" class="input-field sm:w-40 text-base" @change="load">
        <option value="">All Status</option>
        <option value="published">Published</option>
        <option value="unpublished">Unpublished</option>
      </select>
    </div>

    <div class="table-shell">
      <v-data-table
        :headers="headers"
        :items="filteredProducts"
        :group-by="[{ key: 'categoryName', order: 'asc' }]"
        :items-per-page="10"
        :items-per-page-options="[10, 25, 50]"
        :loading="isLoading"
        item-value="id"
        class="vuetify-table"
        density="comfortable"
        hover
        multi-sort
        loading-text="Loading products..."
        items-per-page-text="Products per page"
      >
        <template #top>
          <div class="table-heading">
            <div>
              <h2>Product catalogue</h2>
                <p>{{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'product' : 'products' }} shown</p>
            </div>
            <span class="table-hint">Click a column heading to sort</span>
          </div>
          <button :class="['px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap', p.published ? 'bg-green-100 text-green-700' : 'bg-surface-200 text-ink-500']" @click="togglePublish(p)">{{ p.published ? 'Published' : 'Draft' }}</button>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p class="text-ink-400 font-medium">Price</p>
            <p class="text-ink-700">{{ p.price_min ? `₹${p.price_min}–₹${p.price_max}` : '—' }}</p>
          </div>
          <div>
            <p class="text-ink-400 font-medium">Featured</p>
            <button :class="['px-2 py-0.5 rounded-lg text-xs font-semibold mt-1 inline-block', p.featured ? 'bg-brand-100 text-brand-700' : 'bg-surface-200 text-ink-500']" @click="toggleFeatured(p)">{{ p.featured ? 'Featured' : '—' }}</button>
          </div>
        </div>
        <div class="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
          <router-link :to="`/admin/products/${p.id}/edit`" class="flex-1 text-center px-3 py-2 bg-brand-50 text-brand-600 hover:bg-brand-100 text-xs font-semibold rounded-lg transition-colors">Edit</router-link>
          <button class="flex-1 text-center px-3 py-2 bg-slate-100 text-ink-600 hover:bg-slate-200 text-xs font-semibold rounded-lg transition-colors" @click="duplicate(p)">Duplicate</button>
          <button class="flex-1 text-center px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold rounded-lg transition-colors" @click="remove(p)">Delete</button>
        </div>
      </div>
      <div v-if="products.length === 0" class="text-center py-8 text-ink-400">No products found.</div>
    </div>

    <div v-if="pagination.totalPages > 1" class="flex items-center justify-center gap-2 mt-6 flex-wrap">
      <button
        v-for="p in pagination.totalPages" :key="p"
        :class="['px-3 py-2 rounded-lg text-sm font-medium', p === pagination.page ? 'bg-ink-900 text-white' : 'bg-white border border-surface-200 text-ink-600']"
        @click="page = p; load()"
      >{{ p }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { adminApi } from '../../services/api';

const products = ref([]);
const pagination = ref({ total: 0, page: 1, totalPages: 1 });
const search = ref('');
const statusFilter = ref('');
const page = ref(1);
let searchTimer = null;

async function load() {
  const res = await adminApi.products.list({ search: search.value, status: statusFilter.value, page: page.value, limit: 20 });
  products.value = res.data;
  pagination.value = res.pagination;
}

function scheduleLoad() {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { load(); }, 250);
}

async function togglePublish(p) {
  const next = !p.published;
  p.published = next;
  try {
    await adminApi.products.update(p.id, { published: next });
  } catch (error) {
    p.published = !next;
    throw error;
  }
}
async function toggleFeatured(p) {
  const next = !p.featured;
  p.featured = next;
  try {
    await adminApi.products.update(p.id, { featured: next });
  } catch (error) {
    p.featured = !next;
    throw error;
  }
}
async function duplicate(p) {
  await adminApi.products.duplicate(p.id);
  await load();
}
async function remove(p) {
  if (!confirm(`Delete product "${p.name}"?`)) return;
  await adminApi.products.remove(p.id);
  products.value = products.value.filter((item) => item.id !== p.id);
}

onMounted(load);
</script>
