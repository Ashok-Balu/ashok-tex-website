<template>
  <div>
    <h1 class="font-display text-2xl font-bold text-ink-900 mb-6">Social & SEO</h1>
    <p v-if="saved" class="p-3 mb-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">Social and SEO settings saved.</p>

    <form class="space-y-6" @submit.prevent="save">
      <section class="bg-white rounded-2xl border border-surface-200 p-6 space-y-4">
        <h2 class="text-sm font-semibold text-ink-900 uppercase tracking-wide">Social Links</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Instagram URL</label>
            <input v-model="form.instagramUrl" class="input-field" placeholder="https://instagram.com/yourshop" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">WhatsApp Business URL</label>
            <input v-model="form.whatsappUrl" class="input-field" placeholder="https://wa.me/919999999999" />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Google Maps URL</label>
            <input v-model="form.googleMapsUrl" class="input-field" placeholder="https://maps.google.com/..." />
          </div>
        </div>
      </section>

      <section class="bg-white rounded-2xl border border-surface-200 p-6 space-y-4">
        <h2 class="text-sm font-semibold text-ink-900 uppercase tracking-wide">SEO</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Website Title</label>
            <input v-model="form.metaTitle" class="input-field" placeholder="Ashok Tex | Textile Manufacturer in Karur" />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Meta Description</label>
            <textarea v-model="form.metaDescription" rows="3" class="input-field resize-none" placeholder="Premium textile manufacturer and supplier from Karur, Tamil Nadu." />
          </div>
          <div>
            <label class="block text-sm font-medium text-ink-700 mb-1.5">Keywords</label>
            <textarea v-model="form.keywords" rows="2" class="input-field resize-none" placeholder="cotton fabric, woven fabric, karur textile supplier" />
          </div>
        </div>
      </section>

      <button type="submit" class="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl text-sm">Save Social & SEO</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { adminApi } from '../../services/api';
import { useCompany } from '../../composables/useCompany';

const saved = ref(false);
const form = ref({});
const { refreshCompany } = useCompany();

async function load() {
  const res = await adminApi.settings.company();
  form.value = {
    instagramUrl: '',
    whatsappUrl: '',
    googleMapsUrl: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    ...res.data,
  };
}

async function save() {
  await adminApi.settings.updateCompany(form.value);
  await refreshCompany();
  saved.value = true;
  setTimeout(() => { saved.value = false; }, 3000);
}

onMounted(load);
</script>
