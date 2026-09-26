<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
      <h1 class="font-display text-2xl font-bold text-ink-900">{{ isEdit ? 'Edit Product' : 'New Product' }}</h1>
      <router-link to="/admin/products" class="text-sm text-ink-500 hover:text-ink-800 whitespace-nowrap">← Back</router-link>
    </div>

    <p v-if="formError" class="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{{ formError }}</p>
    <p v-if="saved" class="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">Product saved successfully.</p>

    <v-form class="space-y-8" @submit.prevent="save">
    <fieldset :disabled="uploading" class="space-y-8 min-w-0">

      <!-- Basic Information -->
      <section class="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6 space-y-4">
        <h2 class="text-sm font-semibold text-ink-900 uppercase tracking-wide">Basic Information</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Product Name *</label>
            <input v-model="form.name" required class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Slug <span class="text-ink-400 font-normal">(auto if empty)</span></label>
            <input v-model="form.slug" class="input-field text-base" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Category</label>
            <select v-model="form.categoryId" class="input-field text-base">
              <option :value="null">— Uncategorized —</option>
              <option v-for="opt in categoryOptions" :key="opt.id" :value="opt.id">{{ '—'.repeat(opt.depth) }} {{ opt.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Tags <span class="text-ink-400 font-normal">(comma separated)</span></label>
            <input v-model="tagsInput" class="input-field text-base" placeholder="cotton, checkered" />
          </div>
        </div>
      </section>

      <!-- Description -->
      <section class="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6 space-y-4">
        <h2 class="text-sm font-semibold text-ink-900 uppercase tracking-wide">Description</h2>
        <div>
          <label class="block text-sm font-medium text-ink-700 mb-1.5">Short Description / Tagline</label>
          <input v-model="form.shortDescription" class="input-field text-base" />
        </div>
        <div>
          <label class="block text-sm font-medium text-ink-700 mb-1.5">Full Description</label>
          <textarea v-model="form.description" rows="5" class="input-field text-base resize-none"></textarea>
        </div>
      </section>

      <!-- Specifications -->
      <section class="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6 space-y-4">
        <h2 class="text-sm font-semibold text-ink-900 uppercase tracking-wide">Specifications</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="spec in form.specifications" :key="spec.name" class="space-y-1.5">
            <label class="block text-sm font-medium text-ink-700 mb-1.5">{{ spec.name }}</label>
            <template v-if="getSpecificationOptions(spec.name)?.length">
              <div class="flex items-center gap-2">
                <select v-model="spec.value" class="input-field text-base min-w-0 flex-1">
                  <option value="">-- Select --</option>
                  <option v-for="option in getSpecificationOptions(spec.name)" :key="option" :value="option">
                    {{ option }}
                  </option>
                </select>
                <button
                  v-if="isDeletableSpecificationOption(spec.name, spec.value)"
                  type="button"
                  class="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                  :disabled="deletingOption === spec.name"
                  @click="deleteSpecificationOption(spec.name, spec.value)"
                >{{ deletingOption === spec.name ? 'Deleting...' : 'Delete' }}</button>
              </div>
              <div class="flex gap-2">
                <input
                  v-model="customOptionInputs[spec.name]"
                  class="input-field text-base min-w-0 flex-1"
                  placeholder="Enter a new option"
                  maxlength="100"
                  @keydown.enter.prevent="addSpecificationOption(spec.name)"
                />
                <button
                  type="button"
                  class="px-3 py-2 text-sm font-semibold bg-surface-100 hover:bg-surface-200 rounded-lg disabled:opacity-50"
                  :disabled="savingOption"
                  @click="addSpecificationOption(spec.name)"
                >Add</button>
              </div>
            </template>
            <input v-else v-model="spec.value" class="input-field text-base" />
          </div>
        </div>
      </section>

      <!-- Images -->
      <section class="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6 space-y-4">
        <h2 class="text-sm font-semibold text-ink-900 uppercase tracking-wide">Images</h2>
        <div class="flex flex-col sm:flex-row sm:items-center gap-3">
          <label :class="['inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap', uploading ? 'bg-surface-200 text-ink-400 cursor-wait' : 'bg-brand-50 text-brand-700 hover:bg-brand-100']">
            <svg v-if="uploading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
            {{ uploading ? 'Uploading images...' : 'Choose images' }}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple class="sr-only" :disabled="uploading" @change="uploadImages" />
          </label>
          <span v-if="uploading" class="text-xs text-brand-600 font-medium">Please wait. Keep this page open until the upload finishes.</span>
          <span v-else class="text-xs text-ink-500">Maximum file size: {{ maxImageSize }} per image. Up to {{ maxImagesPerUpload }} images per upload.</span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
          <div v-for="(img, i) in form.images" :key="img.id || img.url" class="relative border border-surface-200 rounded-xl overflow-hidden group">
            <img :src="img.url" :alt="img.altText" class="w-full h-28 object-cover" />
            <span v-if="img.isPrimary" class="absolute top-1 left-1 bg-brand-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">Primary</span>
            <div class="p-1.5 space-y-1 bg-white">
              <input v-model="img.altText" placeholder="Alt text" class="w-full text-xs border border-surface-200 rounded px-1.5 py-1" />
              <div class="flex gap-1">
                <button type="button" class="flex-1 text-[10px] bg-surface-100 hover:bg-surface-200 rounded py-0.5" @click="setPrimary(i)">Set Primary</button>
                <button type="button" class="text-[10px] text-ink-600 px-1 disabled:opacity-40" :disabled="i === 0" :aria-label="`Move ${img.altText || 'image'} earlier`" @click="moveImage(i, -1)">Move up</button>
                <button type="button" class="text-[10px] text-ink-600 px-1 disabled:opacity-40" :disabled="i === form.images.length - 1" :aria-label="`Move ${img.altText || 'image'} later`" @click="moveImage(i, 1)">Move down</button>
                <button type="button" class="text-[10px] text-red-500 px-1" @click="removeImage(i)">Remove</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SEO -->
      <section class="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6 space-y-4">
        <h2 class="text-sm font-semibold text-ink-900 uppercase tracking-wide">SEO</h2>
        <div>
          <label class="block text-sm font-medium text-ink-700 mb-1.5">SEO Title</label>
          <input v-model="form.seoTitle" class="input-field text-base" />
        </div>
        <div>
          <label class="block text-sm font-medium text-ink-700 mb-1.5">Meta Description</label>
          <textarea v-model="form.seoDescription" rows="2" class="input-field text-base resize-none"></textarea>
        </div>
      </section>

      <!-- Visibility -->
      <section class="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6">
        <h2 class="text-sm font-semibold text-ink-900 uppercase tracking-wide mb-4">Visibility</h2>
        <div class="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6">
          <label class="flex items-center gap-2 text-sm text-ink-700"><input v-model="form.published" type="checkbox" class="rounded" /> Published</label>
          <label class="flex items-center gap-2 text-sm text-ink-700"><input v-model="form.featured" type="checkbox" class="rounded" /> Featured</label>
          <label class="flex items-center gap-2 text-sm text-ink-700"><input v-model="form.isLatest" type="checkbox" class="rounded" /> Latest</label>
        </div>
      </section>

      <div class="flex flex-col-reverse sm:flex-row gap-3">
        <button
          type="submit"
          :disabled="uploading || saving"
          :class="[
            'w-full sm:w-auto px-6 py-3 font-semibold rounded-xl text-sm transition-colors',
            uploading || saving ? 'bg-surface-200 text-ink-400 cursor-not-allowed' : 'bg-brand-500 hover:bg-brand-600 text-white'
          ]"
        >
          {{ uploading ? 'Uploading images...' : saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Product') }}
        </button>
        <router-link to="/admin/products" class="w-full sm:w-auto px-6 py-3 bg-surface-100 hover:bg-surface-200 text-ink-700 font-semibold rounded-xl text-sm text-center">Cancel</router-link>
      </div>
    </fieldset>
    </v-form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { adminApi } from '../../services/api';
import { MAX_IMAGE_FILES, MAX_IMAGE_SIZE_LABEL } from '../../../shared/imageUploadLimits.js';
import { useAdminConfirm } from '../../composables/useAdminConfirm';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);
const formError = ref('');
const saved = ref(false);
const uploading = ref(false);
const saving = ref(false);
const savingOption = ref(false);
const deletingOption = ref('');
const categoryOptions = ref([]);
const savedSpecificationOptions = ref({ options: {}, deletedOptions: {} });
const customOptionInputs = ref({});
const STANDARD_SPECIFICATION_FIELDS = [
  'Business Type',
  'Material',
  'Pattern',
  'Technics',
  'Wash Type',
  'Usage / Application',
  'Country of Origin',
];
const STANDARD_SPEC_OPTIONS = {
  'Business Type': ['Manufacturer, Supplier'],
  Material: ['Cotton', 'Woven', 'Linen', 'Cotton Blend', 'Recycled', 'Synthetic', 'Other'],
  Pattern: ['Checked', 'Striped', 'Dobby', 'Waffle', 'Plain', 'Checkered', 'Printed', 'Other'],
  Technics: ['Machine Made', 'Handloom', 'Powerloom', 'Other'],
  'Wash Type': ['Hand Wash', 'Machine Wash', 'Cold Wash', 'Dry Clean Only'],
  'Usage / Application': ['Textile Industry', 'Garment Manufacturing', 'Home Textile', 'Apparel Industry', 'Uniforms', 'Other'],
  'Country of Origin': ['India', 'China', 'Vietnam', 'Bangladesh', 'Other'],
};

function buildStandardSpecifications(items = []) {
  const specificationMap = new Map();
  (items || []).forEach((item) => {
    const label = String(item?.label || item?.name || '').trim();
    if (!label) return;
    specificationMap.set(label.toLowerCase(), item);
  });

  return STANDARD_SPECIFICATION_FIELDS.map((label) => {
    const matched = specificationMap.get(label.toLowerCase()) || null;
    return {
      name: label,
      value: matched?.value ?? matched?.rawValue ?? '',
      unit: matched?.unit ?? '',
    };
  });
}

const form = ref(emptyForm());
const { confirmAction } = useAdminConfirm();
const maxImageSize = MAX_IMAGE_SIZE_LABEL;
const maxImagesPerUpload = MAX_IMAGE_FILES;
const tagsInput = computed({
  get: () => (form.value.tags || []).join(', '),
  set: (val) => { form.value.tags = val.split(',').map((t) => t.trim()).filter(Boolean); },
});

function getSpecificationOptions(name) {
  const deleted = new Set((savedSpecificationOptions.value.deletedOptions?.[name] || []).map((option) => option.toLowerCase()));
  return [...new Set([...(STANDARD_SPEC_OPTIONS[name] || []), ...(savedSpecificationOptions.value.options?.[name] || [])])]
    .filter((option) => !deleted.has(option.toLowerCase()));
}

function isDeletableSpecificationOption(name, value) {
  return !!value && getSpecificationOptions(name).includes(value);
}

async function addSpecificationOption(name) {
  const value = String(customOptionInputs.value[name] || '').trim();
  if (!value || savingOption.value) return;
  const existingOption = getSpecificationOptions(name).find((option) => option.toLowerCase() === value.toLowerCase());
  if (existingOption) {
    form.value.specifications.find((spec) => spec.name === name).value = existingOption;
    customOptionInputs.value[name] = '';
    return;
  }

  savingOption.value = true;
  formError.value = '';
  try {
    const result = await adminApi.settings.addSpecificationOption(name, value);
    savedSpecificationOptions.value = result.data || {};
    form.value.specifications.find((spec) => spec.name === name).value = value;
    customOptionInputs.value[name] = '';
  } catch (error) {
    formError.value = error.message || 'Could not save the new specification option.';
  } finally {
    savingOption.value = false;
  }
}

async function deleteSpecificationOption(name, value) {
  if (!isDeletableSpecificationOption(name, value) || !await confirmAction(`Delete "${value}" from ${name} options?`, { title: 'Delete this option?', confirmText: 'Delete option' })) return;
  deletingOption.value = name;
  formError.value = '';
  try {
    const result = await adminApi.settings.deleteSpecificationOption(name, value);
    savedSpecificationOptions.value = result.data || {};
    const spec = form.value.specifications.find((item) => item.name === name);
    if (spec?.value === value) spec.value = '';
  } catch (error) {
    formError.value = error.message || 'Could not delete the specification option.';
  } finally {
    deletingOption.value = '';
  }
}

function emptyForm() {
  return {
    name: '', slug: '', categoryId: null, tags: [],
    priceMin: null, priceMax: null, priceUnit: 'Meter',
    shortDescription: '', description: '',
    specifications: buildStandardSpecifications(),
    images: [],
    seoTitle: '', seoDescription: '',
    published: true, featured: false, isLatest: false,
  };
}

function flatten(nodes, depth = 0, out = []) {
  for (const node of nodes) {
    out.push({ ...node, depth });
    if (node.children?.length) flatten(node.children, depth + 1, out);
  }
  return out;
}

function setPrimary(index) {
  const [primary] = form.value.images.splice(index, 1);
  form.value.images.unshift(primary);
  syncPrimaryImage();
}

function syncPrimaryImage() {
  form.value.images.forEach((img, index) => { img.isPrimary = index === 0; });
}

function moveImage(index, direction) {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= form.value.images.length) return;
  const images = form.value.images;
  [images[index], images[targetIndex]] = [images[targetIndex], images[index]];
  syncPrimaryImage();
}

function removeImage(index) {
  const [removed] = form.value.images.splice(index, 1);
  if (removed?.isPrimary || !form.value.images.some((image) => image.isPrimary)) {
    syncPrimaryImage();
  }
}

async function uploadImages(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  formError.value = '';
  uploading.value = true;
  try {
    const res = await adminApi.upload(files);
    res.data.forEach((f, i) => {
      form.value.images.push({ url: f.url, altText: form.value.name || '', isPrimary: form.value.images.length === 0 && i === 0 });
    });
    syncPrimaryImage();
  } catch (error) {
    formError.value = error.message || 'Image upload failed. Configure Cloudinary and try again.';
  } finally {
    uploading.value = false;
    event.target.value = '';
  }
}

async function loadProduct(id) {
  const res = await adminApi.products.get(id);
  const p = res?.data;
  if (!p || typeof p !== 'object') {
    throw new Error('Product details were empty. Check the API response and try again.');
  }
  form.value = {
    name: p.name, slug: p.slug, categoryId: p.category_id,
    tags: Array.isArray(p.tags) ? p.tags : [],
    priceMin: p.price_min, priceMax: p.price_max, priceUnit: p.price_unit,
    shortDescription: p.short_description, description: p.description,
    specifications: buildStandardSpecifications(Array.isArray(p.specifications) ? p.specifications : []),
    images: (Array.isArray(p.images) ? p.images : []).map((img) => ({ url: img.url, altText: img.altText, isPrimary: img.isPrimary })),
    seoTitle: p.seo_title, seoDescription: p.seo_description,
    published: !!p.published, featured: !!p.featured, isLatest: !!p.is_latest,
  };
}

async function save() {
  if (uploading.value || saving.value) return;
  formError.value = '';
  saved.value = false;
  saving.value = true;
  try {
    const payload = {
      ...form.value,
      specifications: form.value.specifications
        .filter((spec) => (spec.value || '').toString().trim())
        .map((spec) => ({ label: spec.name, value: spec.value, unit: spec.unit || '' })),
    };
    if (isEdit.value) {
      await adminApi.products.update(route.params.id, payload);
    } else {
      const res = await adminApi.products.create(payload);
      router.push(`/admin/products/${res.data.id}/edit`);
    }
    saved.value = true;
  } catch (e) {
    formError.value = e.message || 'Product could not be saved. Please check the form and try again.';
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  const [categoriesResult, optionsResult] = await Promise.allSettled([
    adminApi.categories.tree(),
    adminApi.settings.specificationOptions(),
  ]);

  const categoriesResponse = categoriesResult.status === 'fulfilled' ? categoriesResult.value : null;
  categoryOptions.value = Array.isArray(categoriesResponse?.data) ? flatten(categoriesResponse.data) : [];

  const optionsResponse = optionsResult.status === 'fulfilled' ? optionsResult.value : null;
  savedSpecificationOptions.value = optionsResponse?.data && typeof optionsResponse.data === 'object'
    ? optionsResponse.data
    : {};

  try {
    if (isEdit.value) await loadProduct(route.params.id);
  } catch (error) {
    formError.value = error.message || 'Unable to load product form data.';
  }
});
</script>
