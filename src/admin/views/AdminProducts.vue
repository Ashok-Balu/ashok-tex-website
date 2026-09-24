<template>
  <div class="page-wrap">
    <header class="page-hero">
      <div class="hero-copy">
        <p class="eyebrow">Inventory</p>
        <h1>Products</h1>
        <p class="hero-subtitle">Manage stock, visibility, and placement across your collections.</p>
      </div>
      <div class="hero-actions">
        <span class="hero-count">{{ summary.total }} in catalogue</span>
        <router-link to="/admin/products/new" class="primary-action"><v-icon icon="mdi-plus" size="17" /> Add Product</router-link>
      </div>
    </header>

    <section class="stats-grid">
      <div class="stats-card stats-card--dark">
        <div class="stats-label-row">
          <span>Total products</span>
          <span class="stats-pill stats-pill--light">Live</span>
        </div>
        <strong>{{ summary.total }}</strong>
      </div>
      <div class="stats-card stats-card--green">
        <div class="stats-label-row">
          <span>Published</span>
          <span class="stats-pill stats-pill--success">Active</span>
        </div>
        <strong>{{ summary.published }}</strong>
      </div>
      <div class="stats-card stats-card--gold">
        <div class="stats-label-row">
          <span>Featured</span>
          <span class="stats-pill stats-pill--warning">Spotlight</span>
        </div>
        <strong>{{ summary.featured }}</strong>
      </div>
    </section>

    <div class="toolbar-panel">
      <v-text-field
        v-model="search"
        class="table-filter table-filter--search"
        label="Search products"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="comfortable"
        hide-details
        clearable
        @update:model-value="scheduleLoad"
      />
      <v-select
        v-model="statusFilter"
        class="table-filter table-filter--status"
        label="Status"
        :items="statusOptions"
        item-title="title"
        item-value="value"
        variant="outlined"
        density="comfortable"
        hide-details
        @update:model-value="load"
      />
      <v-btn class="refresh-button" variant="tonal" icon="mdi-refresh" :loading="isLoading" aria-label="Refresh products" @click="load" />
    </div>

    <div v-if="errorMessage" class="table-alert" role="alert">
      <v-icon icon="mdi-alert-circle-outline" size="20" />
      <span>{{ errorMessage }}</span>
      <v-btn size="small" variant="text" color="error" @click="load">Try again</v-btn>
    </div>

    <div class="table-shell">
      <v-data-table
        :headers="headers"
        :items="filteredProducts"
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
        </template>

        <template v-slot:[`item.name`]="{ item }">
          <div class="table-name-cell">
            <div class="table-name-badge">P</div>
            <div class="table-name-copy">
              <span class="font-semibold text-ink-800">{{ item.name }}</span>
              <small>Product #{{ item.id }}</small>
            </div>
          </div>
        </template>

        <template v-slot:[`item.categoryName`]="{ item }">
          <span class="text-ink-500">{{ item.categoryName }}</span>
        </template>

        <template v-slot:[`item.publishedText`]="{ item }">
          <span :class="['status-badge', item.published ? 'status-badge--success' : 'status-badge--muted']">
            {{ item.publishedText }}
          </span>
        </template>

        <template v-slot:[`item.featuredText`]="{ item }">
          <span :class="['status-badge', item.featured ? 'status-badge--warning' : 'status-badge--muted']">
            {{ item.featuredText }}
          </span>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <div class="action-cluster">
            <v-btn class="row-action row-action--edit" size="small" variant="tonal" :disabled="busyProductId !== null" @click="editProduct(item.id)">Edit</v-btn>
            <v-btn class="row-action" size="small" variant="text" :loading="busyProductId === item.id" :disabled="busyProductId !== null" @click="duplicateProduct(item.id)">Duplicate</v-btn>
            <v-btn class="row-action row-action--delete" size="small" variant="text" :loading="busyProductId === item.id" :disabled="busyProductId !== null" @click="removeProduct(item.id, item.name)">Delete</v-btn>
          </div>
        </template>

        <template #no-data>
          <div class="empty-table-state">
            <v-icon icon="mdi-package-variant-closed" size="34" />
            <strong>No products found</strong>
            <span>Try changing your search or status filter.</span>
          </div>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onBeforeUnmount, onMounted } from 'vue';
import { adminApi } from '../../services/api';

const products = ref([]);
const pagination = ref({ total: 0, page: 1, totalPages: 1 });
const search = ref('');
const statusFilter = ref('');
const page = ref(1);
const isLoading = ref(false);
const errorMessage = ref('');
const busyProductId = ref(null);
let searchTimer = null;

const statusOptions = [
  { title: 'All statuses', value: '' },
  { title: 'Published', value: 'published' },
  { title: 'Unpublished', value: 'unpublished' },
];

const headers = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Category', key: 'categoryName', sortable: true },
  { title: 'Published', key: 'publishedText', sortable: true },
  { title: 'Featured', key: 'featuredText', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
];

const filteredProducts = computed(() => {
  const needle = search.value.trim().toLowerCase();
  return products.value
    .filter((item) => {
      if (statusFilter.value && item.published !== (statusFilter.value === 'published')) return false;
      if (!needle) return true;
      const haystack = [item.name, item.category?.name].join(' ').toLowerCase();
      return haystack.includes(needle);
    })
    .map((item) => ({
      id: item.id,
      name: item.name,
      categoryName: item.category?.name || '—',
      publishedText: item.published ? 'Published' : 'Draft',
      featuredText: item.featured ? 'Featured' : 'Standard',
      published: item.published,
      featured: item.featured,
    }));
});

const summary = computed(() => ({
  total: products.value.length,
  published: products.value.filter((item) => item.published).length,
  featured: products.value.filter((item) => item.featured).length,
}));

async function load() {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const res = await adminApi.products.list({ search: search.value, status: statusFilter.value, page: page.value, limit: 50 });
    products.value = res.data;
    pagination.value = res.pagination;
  } catch (error) {
    errorMessage.value = error?.message || 'Unable to load products. Please try again.';
  } finally {
    isLoading.value = false;
  }
}

function scheduleLoad() {
  if (searchTimer) clearTimeout(searchTimer);
  page.value = 1;
  searchTimer = setTimeout(() => { load(); }, 250);
}

function editProduct(id) {
  window.location.href = `/admin/products/${id}/edit`;
}

async function duplicateProduct(id) {
  busyProductId.value = id;
  try {
    await adminApi.products.duplicate(id);
    await load();
  } catch (error) {
    errorMessage.value = error?.message || 'Unable to duplicate this product.';
  } finally {
    busyProductId.value = null;
  }
}

async function removeProduct(id, name) {
  if (!confirm(`Delete product "${name}"?`)) return;
  busyProductId.value = id;
  try {
    await adminApi.products.remove(id);
    products.value = products.value.filter((item) => item.id !== id);
  } catch (error) {
    errorMessage.value = error?.message || 'Unable to delete this product.';
  } finally {
    busyProductId.value = null;
  }
}

onMounted(load);
onBeforeUnmount(() => {
  if (searchTimer) clearTimeout(searchTimer);
});
</script>

<style scoped>
.page-wrap {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem 0 1.5rem;
  background: linear-gradient(180deg, rgba(255,255,255,0.28), rgba(248,250,252,0.72));
  border-radius: 1.5rem;
}

.page-hero {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.35rem 1.4rem;
  border-radius: 1.5rem;
  background: linear-gradient(120deg, #fff7ed 0%, #ffedd5 58%, #fed7aa 100%);
  color: #431407;
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.16);
}

.page-hero::after {
  content: '';
  position: absolute;
  right: -3rem;
  bottom: -5rem;
  width: 15rem;
  height: 15rem;
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 50%;
  box-shadow: 0 0 0 2.5rem rgba(251, 191, 36, 0.035), 0 0 0 5rem rgba(251, 191, 36, 0.025);
  pointer-events: none;
}

.hero-copy {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.hero-actions {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.hero-count {
  color: rgba(124,45,18,0.7);
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.page-hero .eyebrow {
  margin: 0;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #fbbf24;
}

.page-hero h1 {
  margin: 0;
  font-size: clamp(1.8rem, 2vw, 2.4rem);
  font-weight: 700;
  letter-spacing: -0.05em;
}

.hero-subtitle {
  margin: 0;
  color: rgba(124,45,18,0.78);
  font-size: 0.92rem;
}

.primary-action,
.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.8rem;
  transition: all 0.18s ease;
  font-weight: 600;
}

.primary-action {
  gap: 0.35rem;
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: white;
  padding: 0.68rem 1rem;
  font-size: 0.82rem;
  box-shadow: 0 10px 18px rgba(249, 115, 22, 0.24);
}

.primary-action:hover,
.action-button:hover {
  transform: translateY(-1px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.85rem;
}

.stats-card {
  position: relative;
  overflow: hidden;
  background: white;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);
}

.stats-card::after {
  content: '';
  position: absolute;
  right: -1.6rem;
  bottom: -2.3rem;
  width: 6rem;
  height: 6rem;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 50%;
}

.stats-card--dark {
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
  color: #431407;
}

.stats-card--green { border-top: 3px solid #10b981; }
.stats-card--gold { border-top: 3px solid #f59e0b; }

.stats-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.stats-card span {
  display: block;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.8;
}

.stats-card strong {
  display: block;
  margin-top: 0.8rem;
  font-size: clamp(1.6rem, 2vw, 2rem);
  letter-spacing: -0.06em;
}

.stats-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.25rem 0.55rem;
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.stats-pill--light {
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.92);
}

.stats-pill--success {
  background: rgba(16, 185, 129, 0.12);
  color: #047857;
}

.stats-pill--warning {
  background: rgba(245, 158, 11, 0.12);
  color: #b45309;
}

.toolbar-panel {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem;
  border-radius: 1.2rem;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: rgba(255,255,255,0.9);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.05);
}

.table-filter {
  flex: 1 1 auto;
}

.table-filter--status {
  flex: 0 0 12rem;
}

:deep(.table-filter .v-field) {
  border-radius: 0.75rem;
  background: white;
}

.refresh-button {
  flex: 0 0 auto;
  border-radius: 0.75rem;
}

.table-shell {
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: rgba(255,255,255,0.96);
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
}

.table-alert {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.7rem 0.9rem;
  border: 1px solid #fecaca;
  border-radius: 0.85rem;
  background: #fef2f2;
  color: #991b1b;
  font-size: 0.82rem;
}

.table-alert span {
  flex: 1;
}

:deep(.v-data-table__wrapper) {
  border-radius: 1rem;
  overflow-x: auto;
}

:deep(.v-data-table-footer) {
  border-top: 1px solid rgba(226, 232, 240, 0.95);
  padding: 0.7rem 1rem;
}

.table-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.1rem 0.8rem;
  background: white;
}

.table-heading h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 700;
}

.table-heading p,
.table-hint {
  margin: 0.2rem 0 0;
  color: #64748b;
  font-size: 0.75rem;
}

.table-hint {
  margin: 0;
  white-space: nowrap;
}

:deep(.v-data-table__thead th),
:deep(.v-data-table-header th),
:deep(.v-data-table__th) {
  background: #f8fafc !important;
  color: #475569 !important;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2) !important;
  vertical-align: middle;
}

:deep(.v-data-table__thead .v-data-table-header__content),
:deep(.v-data-table__thead .v-data-table-header__sort-icon) {
  color: #475569 !important;
}

:deep(.v-data-table__thead th) {
  padding-top: 0.85rem !important;
  padding-bottom: 0.85rem !important;
}

:deep(.v-data-table__td) {
  padding-top: 0.9rem !important;
  padding-bottom: 0.9rem !important;
  border-bottom: 1px solid rgba(226, 232, 240, 0.95) !important;
  color: #1f2937;
  vertical-align: middle;
}

:deep(.v-data-table__tbody tr:nth-child(even)) {
  background: rgba(248, 250, 252, 0.6);
}

:deep(.v-data-table__tr:hover) {
  background: rgba(255, 247, 237, 0.95) !important;
}

.table-name-cell {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 220px;
}

.table-name-copy {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.table-name-copy small {
  color: #94a3b8;
  font-size: 0.68rem;
}

.table-name-badge {
  width: 2rem;
  height: 2rem;
  border-radius: 0.7rem;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #fef3c7 0%, #fdba74 100%);
  color: #9a4d0a;
  font-weight: 700;
  font-size: 0.8rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.38rem 0.7rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.status-badge--success {
  background: rgba(16, 185, 129, 0.12);
  color: #047857;
}

.status-badge--warning {
  background: rgba(245, 158, 11, 0.12);
  color: #b45309;
}

.status-badge--muted {
  background: rgba(148, 163, 184, 0.12);
  color: #475569;
}

.action-cluster {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.4rem;
  min-width: 7.5rem;
}

:deep(.action-cluster .v-btn) {
  min-width: auto;
  height: 2.1rem;
  padding: 0 0.65rem;
  border-radius: 0.6rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0;
  text-transform: none;
}

:deep(.action-cluster .row-action--edit) {
  color: #c2410c;
  background: #fff7ed;
}

:deep(.action-cluster .row-action--delete) {
  color: #dc2626;
}

.empty-table-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 3rem 1rem;
  color: #64748b;
}

.empty-table-state strong {
  color: #334155;
  font-size: 0.95rem;
}

.empty-table-state span {
  font-size: 0.78rem;
}

.action-button {
  border: 1px solid transparent;
  padding: 0.46rem 0.7rem;
  font-size: 0.7rem;
  cursor: pointer;
}

.action-button--secondary {
  background: #fff7ed;
  color: #c2410c;
  border-color: rgba(251, 146, 60, 0.2);
}

.action-button--ghost {
  background: #f8fafc;
  color: #334155;
  border-color: rgba(148, 163, 184, 0.2);
}

.action-button--danger {
  background: #fef2f2;
  color: #b91c1c;
  border-color: rgba(239, 68, 68, 0.2);
}

@media (max-width: 640px) {
  .page-hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-actions {
    width: 100%;
    justify-content: space-between;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .toolbar-panel {
    flex-direction: column;
    align-items: stretch;
  }

  .table-filter--status {
    flex-basis: auto;
  }

  .refresh-button {
    align-self: flex-end;
  }

  .table-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .table-hint {
    white-space: normal;
  }

  .action-cluster {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}

</style>

