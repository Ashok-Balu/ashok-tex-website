<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
      <h1 class="font-display text-2xl font-bold text-ink-900">{{ isEdit ? 'Edit Category' : 'New Category' }}</h1>
      <router-link to="/admin/categories" class="text-sm text-ink-500 hover:text-ink-800 whitespace-nowrap">← Back</router-link>
    </div>

    <p v-if="formError" class="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
      {{ formError }}
    </p>

    <form class="mx-auto max-w-5xl space-y-5 rounded-2xl border border-surface-200 bg-white p-4 sm:p-6 shadow-sm" @submit.prevent="save">
      <div>
        <label class="block text-sm font-medium text-ink-700 mb-1.5">Name *</label>
        <input v-model="form.name" required class="input-field text-base" />
      </div>

      <div>
        <label class="block text-sm font-medium text-ink-700 mb-1.5">Slug <span class="text-ink-400 font-normal">(auto-generated if empty)</span></label>
        <input v-model="form.slug" class="input-field text-base" />
      </div>

      <div>
        <label class="block text-sm font-medium text-ink-700 mb-1.5">Parent Category</label>
        <select v-model="form.parentId" class="input-field text-base">
          <option :value="null">— None (top level) —</option>
          <option v-for="opt in parentOptions" :key="opt.id" :value="opt.id" :disabled="isEdit && opt.id === currentId">
            {{ '—'.repeat(opt.depth) }} {{ opt.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-ink-700 mb-1.5">Description</label>
        <textarea v-model="form.description" rows="4" class="input-field text-base resize-none"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-ink-700 mb-1.5">Image URL</label>
        <input v-model="form.image" class="input-field text-base" placeholder="https://..." />
        <input type="file" accept="image/*" class="mt-2 text-xs w-full" @change="(e) => uploadImage(e, 'image')" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-ink-700 mb-1.5">SEO Title</label>
          <input v-model="form.seoTitle" class="input-field text-base" />
        </div>
        <div>
          <label class="block text-sm font-medium text-ink-700 mb-1.5">Accent Color</label>
          <div class="flex items-center gap-3">
            <input v-model="form.accentColor" type="color" class="h-10 w-14 cursor-pointer rounded border border-slate-300 bg-transparent p-1" />
            <div class="flex-1 text-xs sm:text-sm text-ink-500">
              <p>{{ form.accentColor }}</p>
              <span class="inline-block h-6 w-full rounded border border-slate-300 mt-1" :style="{ backgroundColor: form.accentColor }"></span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-ink-700 mb-1.5">SEO Description</label>
        <textarea v-model="form.seoDescription" rows="3" class="input-field text-base resize-none"></textarea>
      </div>

      <label class="flex items-center gap-2 text-sm text-ink-700">
        <input v-model="form.active" type="checkbox" class="rounded" /> Active (visible on website)
      </label>

      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <button type="submit" class="w-full sm:flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl text-sm">
          {{ isEdit ? 'Save Changes' : 'Create Category' }}
        </button>
        <router-link to="/admin/categories" class="w-full sm:flex-1 py-2.5 bg-surface-100 hover:bg-surface-200 text-ink-700 font-semibold rounded-xl text-sm text-center">
          Cancel
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { adminApi } from '../../services/api';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);
const currentId = computed(() => Number(route.params.id));
const formError = ref('');
const tree = ref([]);
const form = ref(emptyForm());

function emptyForm() {
  return {
    name: '',
    slug: '',
    parentId: null,
    description: '',
    image: '',
    accentColor: '#1a6b3a',
    seoTitle: '',
    seoDescription: '',
    active: true,
  };
}

function flatten(nodes, depth = 0, out = []) {
  for (const node of nodes) {
    out.push({ ...node, depth });
    if (node.children?.length) flatten(node.children, depth + 1, out);
  }
  return out;
}

const parentOptions = computed(() => flatten(tree.value));

async function load() {
  const res = await adminApi.categories.tree();
  tree.value = res.data;

  if (isEdit.value) {
    const category = flatten(tree.value).find((item) => item.id === currentId.value);
    if (!category) return;

    form.value = {
      name: category.name || '',
      slug: category.slug || '',
      parentId: category.parent_id ?? null,
      description: category.description || '',
      image: category.image || '',
      accentColor: category.accent_color || '#1a6b3a',
      seoTitle: category.seo_title || '',
      seoDescription: category.seo_description || '',
      active: !!category.active,
    };
  }
}

async function save() {
  formError.value = '';
  try {
    if (isEdit.value) {
      await adminApi.categories.update(currentId.value, form.value);
    } else {
      await adminApi.categories.create(form.value);
    }
    router.push('/admin/categories');
  } catch (error) {
    formError.value = error.message || 'Unable to save category.';
  }
}

async function uploadImage(event, field) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  const res = await adminApi.upload(files);
  form.value[field] = res.data[0].url;
}

onMounted(async () => {
  await load();
});
</script>
