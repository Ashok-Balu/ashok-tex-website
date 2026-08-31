<template>
  <div class="categories-page space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
      <h1 class="font-display text-2xl font-bold text-ink-900">Categories</h1>
      <router-link to="/admin/categories/new" class="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl inline-flex items-center whitespace-nowrap">+ Add Category</router-link>
    </div>

    <div v-if="error" class="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{{ error }}</div>

    <!-- Desktop Table View -->
    <div class="hidden md:block w-full">
      <div class="bg-slate-200/90 rounded-xl border border-slate-300 overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-700 text-left text-white sticky top-0">
              <tr>
                <th class="px-4 py-3 font-medium">Name</th>
                <th class="px-4 py-3 font-medium">Slug</th>
                <th class="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in flatRows" :key="row.id" class="border-b border-slate-300 bg-slate-100/80 hover:bg-slate-100">
                <td class="px-4 py-3 text-ink-800 font-medium" :style="{ paddingLeft: `${1 + row.depth * 1.5}rem` }">
                  <span v-if="row.depth > 0" class="text-ink-300 mr-1">↳</span>{{ row.name }}
                </td>
                <td class="px-4 py-3 text-ink-500 break-all">{{ row.slug }}</td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <div class="flex justify-end gap-3 flex-wrap">
                    <router-link :to="`/admin/categories/${row.id}/edit`" class="text-brand-600 hover:underline text-xs font-semibold">Edit</router-link>
                    <button type="button" class="text-ink-500 hover:underline text-xs font-semibold" @click="toggleActive(row)">{{ row.active ? 'Disable' : 'Enable' }}</button>
                    <button type="button" class="text-red-600 hover:underline text-xs font-semibold" @click="remove(row)">Delete</button>
                  </div>
                </td>
              </tr>
              <tr v-if="flatRows.length === 0">
                <td colspan="3" class="px-4 py-8 text-center text-ink-400">No categories yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Mobile Card View -->
    <div class="md:hidden space-y-3">
      <div v-for="row in flatRows" :key="row.id" class="bg-white rounded-xl border border-slate-200 p-4 space-y-3 hover:shadow-md transition-shadow">
        <div class="space-y-2">
          <p class="text-xs text-ink-400 font-medium uppercase">Name</p>
          <p class="text-sm font-semibold text-ink-900">
            <span v-if="row.depth > 0" class="text-ink-300">{'·'.repeat(row.depth)}&nbsp;</span>{{ row.name }}
          </p>
        </div>
        <div class="space-y-2">
          <p class="text-xs text-ink-400 font-medium uppercase">Slug</p>
          <p class="text-sm text-ink-500 break-all">{{ row.slug }}</p>
        </div>
        <div class="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
          <router-link :to="`/admin/categories/${row.id}/edit`" class="flex-1 text-center px-3 py-2 bg-brand-50 text-brand-600 hover:bg-brand-100 text-xs font-semibold rounded-lg transition-colors">Edit</router-link>
          <button type="button" class="flex-1 text-center px-3 py-2 bg-slate-100 text-ink-600 hover:bg-slate-200 text-xs font-semibold rounded-lg transition-colors" @click="toggleActive(row)">{{ row.active ? 'Disable' : 'Enable' }}</button>
          <button type="button" class="flex-1 text-center px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold rounded-lg transition-colors" @click="remove(row)">Delete</button>
        </div>
      </div>
      <div v-if="flatRows.length === 0" class="text-center py-8 text-ink-400">No categories yet.</div>
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

.categories-page table th,
.categories-page table td {
  border-bottom: 1px solid rgba(148, 163, 184, 0.55);
}

.categories-page table tbody tr:last-child td {
  border-bottom: none;
}
</style>
