<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
      <h1 class="font-display text-2xl font-bold text-ink-900">Testimonials</h1>
      <button class="w-full sm:w-auto px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl whitespace-nowrap" @click="openCreate">+ Add Testimonial</button>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden md:block bg-white rounded-2xl border border-surface-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-surface-50 text-ink-500 text-left sticky top-0">
          <tr>
            <th class="px-4 py-3 font-medium">Customer</th>
            <th class="px-4 py-3 font-medium">Quote</th>
            <th class="px-4 py-3 font-medium">Rating</th>
            <th class="px-4 py-3 font-medium">Status</th>
            <th class="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-100">
          <tr v-for="t in testimonials" :key="t.id">
            <td class="px-4 py-3 text-ink-800 font-medium">{{ t.customer_name }}<br /><span class="text-xs text-ink-400">{{ t.role }}</span></td>
            <td class="px-4 py-3 text-ink-500 max-w-xs truncate">{{ t.quote }}</td>
            <td class="px-4 py-3 text-ink-500">{{ t.rating }}★</td>
            <td class="px-4 py-3">
              <button :class="['px-2 py-0.5 rounded-lg text-xs font-semibold', t.published ? 'bg-green-100 text-green-700' : 'bg-surface-200 text-ink-500']" @click="togglePublish(t)">{{ t.published ? 'Published' : 'Draft' }}</button>
            </td>
            <td class="px-4 py-3 text-right space-x-2 whitespace-nowrap">
              <button class="text-brand-600 hover:underline text-xs font-semibold" @click="openEdit(t)">Edit</button>
              <button class="text-red-600 hover:underline text-xs font-semibold" @click="remove(t)">Delete</button>
            </td>
          </tr>
          <tr v-if="testimonials.length === 0"><td colspan="5" class="px-4 py-8 text-center text-ink-400">No testimonials yet.</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card View -->
    <div class="md:hidden space-y-3">
      <div v-for="t in testimonials" :key="t.id" class="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-ink-900">{{ t.customer_name }}</p>
            <p class="text-xs text-ink-400 mt-1">{{ t.role || '—' }}</p>
          </div>
          <button :class="['px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap', t.published ? 'bg-green-100 text-green-700' : 'bg-surface-200 text-ink-500']" @click="togglePublish(t)">{{ t.published ? 'Published' : 'Draft' }}</button>
        </div>
        <p class="text-sm text-ink-600 italic line-clamp-3">{{ t.quote }}</p>
        <div class="flex items-center justify-between pt-2 border-t border-slate-200">
          <span class="text-sm font-medium text-ink-700">{{ t.rating }}★</span>
          <div class="flex gap-2">
            <button class="px-3 py-1.5 bg-brand-50 text-brand-600 hover:bg-brand-100 text-xs font-semibold rounded-lg" @click="openEdit(t)">Edit</button>
            <button class="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold rounded-lg" @click="remove(t)">Delete</button>
          </div>
        </div>
      </div>
      <div v-if="testimonials.length === 0" class="text-center py-8 text-ink-400">No testimonials yet.</div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-ink-950/50 flex items-center justify-center p-4 z-50 overflow-y-auto" @click.self="showModal = false">
      <div class="bg-white rounded-3xl shadow-float w-full max-w-lg p-4 sm:p-8 my-8 sm:my-0">
        <h2 class="font-display text-xl font-bold text-ink-900 mb-5">{{ editing ? 'Edit Testimonial' : 'New Testimonial' }}</h2>
        <form class="space-y-4" @submit.prevent="save">
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Customer Name *</label>
            <input v-model="form.customerName" required class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Role / Company</label>
            <input v-model="form.role" class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Quote *</label>
            <textarea v-model="form.quote" rows="3" required class="input-field text-base resize-none"></textarea>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-ink-700 mb-1.5">Rating</label>
              <select v-model.number="form.rating" class="input-field text-base">
                <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
            <label class="flex items-center gap-2 text-sm text-ink-700 sm:mt-6">
              <input v-model="form.published" type="checkbox" class="rounded" /> Published
            </label>
          </div>
          <div class="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button type="button" class="w-full sm:flex-1 py-2.5 bg-surface-100 hover:bg-surface-200 text-ink-700 font-semibold rounded-xl text-sm" @click="showModal = false">Cancel</button>
            <button type="submit" class="w-full sm:flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl text-sm">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { adminApi } from '../../services/api';

const testimonials = ref([]);
const showModal = ref(false);
const editing = ref(null);
const form = ref(emptyForm());

function emptyForm() {
  return { customerName: '', role: '', quote: '', rating: 5, published: true };
}

async function load() {
  const res = await adminApi.testimonials.list({ page: 1, limit: 100 });
  testimonials.value = res.data || [];
}

function openCreate() {
  editing.value = null;
  form.value = emptyForm();
  showModal.value = true;
}

function openEdit(t) {
  editing.value = t;
  form.value = { customerName: t.customer_name, role: t.role, quote: t.quote, rating: t.rating, published: !!t.published };
  showModal.value = true;
}

async function save() {
  if (editing.value) await adminApi.testimonials.update(editing.value.id, form.value);
  else await adminApi.testimonials.create(form.value);
  showModal.value = false;
  await load();
}

async function togglePublish(t) {
  const nextValue = !t.published;
  t.published = nextValue;
  try {
    await adminApi.testimonials.update(t.id, { published: nextValue });
  } catch (error) {
    t.published = !nextValue;
    throw error;
  }
}

async function remove(t) {
  if (!confirm(`Delete testimonial from "${t.customer_name}"?`)) return;
  await adminApi.testimonials.remove(t.id);
  testimonials.value = testimonials.value.filter((item) => item.id !== t.id);
}

onMounted(load);
</script>
