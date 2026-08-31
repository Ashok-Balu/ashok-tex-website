<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-display text-2xl font-bold text-ink-900">Navigation</h1>
      <button class="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl" @click="openCreate">+ Add Menu Item</button>
    </div>

    <div class="bg-white rounded-2xl border border-surface-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-surface-50 text-ink-500 text-left">
          <tr>
            <th class="px-4 py-3 font-medium">Label</th>
            <th class="px-4 py-3 font-medium">Link</th>
            <th class="px-4 py-3 font-medium">Order</th>
            <th class="px-4 py-3 font-medium">Visible</th>
            <th class="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-100">
          <tr v-for="item in items" :key="item.id">
            <td class="px-4 py-3 text-ink-800 font-medium">{{ item.label }}</td>
            <td class="px-4 py-3 text-ink-500">{{ item.link }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-1">
                <button class="text-ink-400 hover:text-ink-700" @click="move(item, -1)">↑</button>
                <button class="text-ink-400 hover:text-ink-700" @click="move(item, 1)">↓</button>
              </div>
            </td>
            <td class="px-4 py-3">
              <button :class="['px-2 py-0.5 rounded-lg text-xs font-semibold', item.visible ? 'bg-green-100 text-green-700' : 'bg-surface-200 text-ink-500']" @click="toggleVisible(item)">{{ item.visible ? 'Visible' : 'Hidden' }}</button>
            </td>
            <td class="px-4 py-3 text-right space-x-2">
              <button class="text-brand-600 hover:underline text-xs font-semibold" @click="openEdit(item)">Edit</button>
              <button class="text-red-600 hover:underline text-xs font-semibold" @click="remove(item)">Delete</button>
            </td>
          </tr>
          <tr v-if="items.length === 0"><td colspan="5" class="px-4 py-8 text-center text-ink-400">No menu items yet.</td></tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-ink-950/50 flex items-center justify-center p-4 z-50" @click.self="showModal = false">
      <div class="bg-white rounded-3xl shadow-float w-full max-w-md p-8">
        <h2 class="font-display text-xl font-bold text-ink-900 mb-5">{{ editing ? 'Edit Menu Item' : 'New Menu Item' }}</h2>
        <form class="space-y-4" @submit.prevent="save">
          <div><label class="block text-sm font-medium text-ink-700 mb-1.5">Label *</label><input v-model="form.label" required class="input-field" /></div>
          <div><label class="block text-sm font-medium text-ink-700 mb-1.5">Link (e.g. /products)</label><input v-model="form.link" class="input-field" /></div>
          <label class="flex items-center gap-2 text-sm text-ink-700"><input v-model="form.visible" type="checkbox" class="rounded" /> Visible</label>
          <div class="flex gap-3 pt-2">
            <button type="submit" class="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl text-sm">Save</button>
            <button type="button" class="flex-1 py-2.5 bg-surface-100 hover:bg-surface-200 text-ink-700 font-semibold rounded-xl text-sm" @click="showModal = false">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { adminApi } from '../../services/api';

const items = ref([]);
const showModal = ref(false);
const editing = ref(null);
const form = ref({ label: '', link: '', visible: true });

async function load() {
  const res = await adminApi.settings.navigation();
  items.value = res.data;
}

function openCreate() {
  editing.value = null;
  form.value = { label: '', link: '', visible: true };
  showModal.value = true;
}

function openEdit(item) {
  editing.value = item;
  form.value = { label: item.label, link: item.link, visible: !!item.visible };
  showModal.value = true;
}

async function save() {
  if (editing.value) await adminApi.settings.updateNavItem(editing.value.id, form.value);
  else await adminApi.settings.createNavItem(form.value);
  showModal.value = false;
  await load();
}

async function toggleVisible(item) {
  const nextValue = !item.visible;
  item.visible = nextValue;
  try {
    await adminApi.settings.updateNavItem(item.id, { visible: nextValue });
  } catch (error) {
    item.visible = !nextValue;
    throw error;
  }
}

async function remove(item) {
  if (!confirm(`Delete menu item "${item.label}"?`)) return;
  await adminApi.settings.removeNavItem(item.id);
  items.value = items.value.filter((entry) => entry.id !== item.id);
}

async function move(item, dir) {
  const idx = items.value.findIndex((i) => i.id === item.id);
  const swapIdx = idx + dir;
  if (swapIdx < 0 || swapIdx >= items.value.length) return;
  const reordered = [...items.value];
  [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];
  items.value = reordered;
  await adminApi.settings.reorderNavItems(reordered.map((i) => i.id));
}

onMounted(load);
</script>
