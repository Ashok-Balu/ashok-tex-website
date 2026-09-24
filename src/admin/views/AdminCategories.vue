<template>
  <div class="categories-page space-y-6 pb-8">
    <header class="page-hero">
      <div>
        <p class="eyebrow">Catalog structure</p>
        <h1>Categories</h1>
      </div>
      <router-link to="/admin/categories/new" class="primary-action">+ Add Category</router-link>
    </header>

    <div v-if="error" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{{ error }}</div>

    <section class="stats-grid">
      <div class="stats-card stats-card--dark">
        <span>Total</span>
        <strong>{{ totalCategories }}</strong>
      </div>
      <div class="stats-card">
        <span>Active</span>
        <strong>{{ activeCategories }}</strong>
      </div>
      <div class="stats-card">
        <span>Parents</span>
        <strong>{{ parentCategories }}</strong>
      </div>
    </section>

    <div class="hidden md:block w-full">
      <div class="table-shell">
        <v-data-table
          :headers="headers"
          :items="flatRows"
          item-value="id"
          :items-per-page="10"
          :items-per-page-options="[10, 25, 50]"
          class="admin-data-table"
          density="comfortable"
          hover
          items-per-page-text="Categories per page"
        >
          <template #top>
            <div class="table-heading">
              <div><h2>Category structure</h2><p>{{ flatRows.length }} categories in your catalogue</p></div>
              <span>Parent and child categories</span>
            </div>
          </template>
          <template #item.name="{ item }">
            <div class="category-name" :style="{ paddingLeft: `${item.depth * 1.4}rem` }">
              <span v-if="item.depth > 0" class="category-branch">↳</span>
              <span>{{ item.name }}</span>
            </div>
          </template>
          <template #item.slug="{ item }"><span class="slug-text">{{ item.slug }}</span></template>
          <template #item.actions="{ item }">
            <div class="table-actions">
              <router-link :to="`/admin/categories/${item.id}/edit`" class="action-button action-button--secondary">Edit</router-link>
              <button type="button" class="action-button action-button--ghost" @click="toggleActive(item)">{{ item.active ? 'Disable' : 'Enable' }}</button>
              <button type="button" class="action-button action-button--danger" @click="remove(item)">Delete</button>
            </div>
          </template>
          <template #no-data><div class="empty-table-state">No categories yet.</div></template>
        </v-data-table>
      </div>
    </div>

    <div class="md:hidden space-y-3">
      <div v-for="row in flatRows" :key="row.id" class="rounded-[22px] border border-surface-200 bg-white p-4 shadow-sm transition hover:shadow-md">
        <div class="space-y-2">
          <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-400">Name</p>
          <p class="text-sm font-semibold text-ink-900">
            <span v-if="row.depth > 0" class="text-ink-300">{'·'.repeat(row.depth)}&nbsp;</span>{{ row.name }}
          </p>
        </div>
        <div class="mt-3 space-y-2">
          <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-400">Slug</p>
          <p class="text-sm text-ink-500 break-all">{{ row.slug }}</p>
        </div>
        <div class="mt-4 flex flex-wrap gap-2 border-t border-surface-100 pt-3">
          <router-link :to="`/admin/categories/${row.id}/edit`" class="flex-1 rounded-lg bg-brand-50 px-3 py-2 text-center text-xs font-semibold text-brand-700">Edit</router-link>
          <button type="button" class="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-center text-xs font-semibold text-ink-600" @click="toggleActive(row)">{{ row.active ? 'Disable' : 'Enable' }}</button>
          <button type="button" class="flex-1 rounded-lg bg-red-50 px-3 py-2 text-center text-xs font-semibold text-red-600" @click="remove(row)">Delete</button>
        </div>
      </div>
      <div v-if="flatRows.length === 0" class="py-10 text-center text-ink-400">No categories yet.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { adminApi } from '../../services/api';

const tree = ref([]);
const error = ref('');
const showModal = ref(false);
const editing = ref(null);
const formError = ref('');

const form = ref(emptyForm());

const headers = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Slug', key: 'slug', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
];

function emptyForm() {
  return { name: '', slug: '', parentId: null, description: '', image: '', accentColor: '#1a6b3a', seoTitle: '', seoDescription: '', active: true };
}

function flatten(nodes, depth = 0, out = []) {
  for (const node of nodes) {
    out.push({ ...node, depth });
    if (node.children?.length) flatten(node.children, depth + 1, out);
  }
  return out;
}

const flatRows = computed(() => flatten(tree.value));
const parentOptions = computed(() => flatRows.value);
const totalCategories = computed(() => flatRows.value.length);
const activeCategories = computed(() => flatRows.value.filter((row) => row.active).length);
const parentCategories = computed(() => flatRows.value.filter((row) => row.depth === 0).length);

function updateTreeActive(nodeId, active) {
  const visit = (nodes) => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        node.active = active;
        return true;
      }
      if (node.children?.length && visit(node.children)) return true;
    }
    return false;
  };
  visit(tree.value);
}

async function load() {
  const res = await adminApi.categories.tree();
  tree.value = res.data;
}

function openCreate() {
  editing.value = null;
  form.value = emptyForm();
  formError.value = '';
  showModal.value = true;
}

function openEdit(row) {
  editing.value = row;
  form.value = {
    name: row.name, slug: row.slug, parentId: row.parent_id, description: row.description,
    image: row.image, accentColor: row.accent_color, seoTitle: row.seo_title,
    seoDescription: row.seo_description, active: !!row.active,
  };
  formError.value = '';
  showModal.value = true;
}

async function save() {
  formError.value = '';
  try {
    if (editing.value) {
      await adminApi.categories.update(editing.value.id, form.value);
    } else {
      await adminApi.categories.create(form.value);
    }
    showModal.value = false;
    await load();
  } catch (e) {
    formError.value = e.message;
  }
}

async function toggleActive(row) {
  const nextValue = !row.active;
  updateTreeActive(row.id, nextValue);
  try {
    await adminApi.categories.update(row.id, { active: nextValue });
  } catch (error) {
    updateTreeActive(row.id, row.active);
    throw error;
  }
}

async function remove(row) {
  if (!confirm(`Delete category "${row.name}"?`)) return;
  try {
    await adminApi.categories.remove(row.id);
    tree.value = tree.value.filter((node) => node.id !== row.id).map((node) => ({ ...node, children: (node.children || []).filter((child) => child.id !== row.id) }));
  } catch (e) {
    error.value = e.message;
  }
}

async function uploadImage(event, field) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  const res = await adminApi.upload(files);
  form.value[field] = res.data[0].url;
}

onMounted(() => {
  form.value = emptyForm();
  showModal.value = false;
  load();
});
</script>

<style scoped>
.categories-page {
  min-height: 100%;
}

.page-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.3rem 1.4rem;
  border-radius: 1.6rem;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 58%, #fed7aa 100%);
  color: #431407;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14);
}

.page-hero .eyebrow {
  margin: 0;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #c2410c;
}

.page-hero h1 {
  margin: 0.5rem 0 0;
  font-size: clamp(1.9rem, 2vw, 2.8rem);
  font-weight: 700;
  letter-spacing: -0.04em;
}

.primary-action,
.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.9rem;
  transition: all 180ms ease;
  font-weight: 600;
}

.primary-action {
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: white;
  padding: 0.8rem 1.2rem;
  font-size: 0.82rem;
  box-shadow: 0 10px 22px rgba(249, 115, 22, 0.25);
}

.primary-action:hover,
.action-button:hover {
  transform: translateY(-1px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.stats-card {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 1.2rem;
  padding: 1rem 1.1rem;
  box-shadow: 0 12px 22px rgba(15, 23, 42, 0.04);
}

.stats-card--dark {
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
  color: #431407;
}

.stats-card span {
  display: block;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
}

.stats-card strong {
  display: block;
  margin-top: 0.5rem;
  font-size: clamp(1.35rem, 2vw, 2rem);
  letter-spacing: -0.05em;
}

.table-shell {
  overflow: hidden;
  border-radius: 1.6rem;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.05);
}

.table-shell table {
  width: 100%;
  border-collapse: collapse;
}

.table-shell thead {
  background: #fff7ed;
  color: #9a3412;
}

.table-shell th,
.table-shell td {
  border-bottom: 1px solid rgba(148, 163, 184, 0.35);
}

.table-shell tbody tr:last-child td {
  border-bottom: none;
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
.table-heading > span {
  margin: 0.2rem 0 0;
  color: #64748b;
  font-size: 0.75rem;
}

.category-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 14rem;
  color: #1e293b;
  font-weight: 650;
}

.category-branch {
  color: #cbd5e1;
  font-size: 1rem;
}

.slug-text {
  color: #64748b;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.78rem;
}

.table-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.empty-table-state {
  padding: 3rem 1rem;
  color: #94a3b8;
  text-align: center;
}

:deep(.admin-data-table .v-data-table__thead th),
:deep(.admin-data-table .v-data-table-header th),
:deep(.admin-data-table .v-data-table__th) {
  background: #f8fafc !important;
  color: #475569 !important;
  border-bottom: 1px solid #e2e8f0 !important;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

:deep(.admin-data-table .v-data-table__td) {
  border-bottom: 1px solid #f1f5f9 !important;
  color: #334155;
}

:deep(.admin-data-table .v-data-table-footer) {
  border-top: 1px solid #e2e8f0;
  padding: 0.65rem 1rem;
}

.action-button {
  border: 1px solid transparent;
  padding: 0.5rem 0.75rem;
  font-size: 0.72rem;
}

.action-button--secondary {
  background: rgba(254, 242, 242, 0.9);
  color: #c2410c;
  border-color: rgba(253, 186, 116, 0.4);
}

.action-button--ghost {
  background: rgba(241, 245, 249, 0.9);
  color: #334155;
  border-color: rgba(148, 163, 184, 0.25);
}

.action-button--danger {
  background: rgba(254, 226, 226, 0.9);
  color: #b91c1c;
  border-color: rgba(239, 68, 68, 0.18);
}

@media (max-width: 640px) {
  .page-hero {
    flex-direction: column;
    align-items: stretch;
    padding: 1.1rem 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
