<template>
  <div>
    <h1 class="font-display text-2xl font-bold text-ink-900 mb-6">Homepage Sections</h1>
    <p class="text-sm text-ink-500 mb-6">Control which sections appear on the homepage, their headings, and order.</p>

    <div class="space-y-4">
      <div v-for="section in sections" :key="section.id" class="bg-white rounded-2xl border border-surface-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-ink-900">{{ section.section_key.replace(/_/g, ' ') }}</h2>
          <label class="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" class="rounded" :checked="!!section.enabled" @change="toggle(section, $event.target.checked)" /> Enabled
          </label>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-ink-500 mb-1">Title</label>
            <input v-model="section.title" class="input-field" @blur="update(section)" />
          </div>
          <div>
            <label class="block text-xs font-medium text-ink-500 mb-1">Subtitle</label>
            <input v-model="section.subtitle" class="input-field" @blur="update(section)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { adminApi } from '../../services/api';

const sections = ref([]);

async function load() {
  const res = await adminApi.settings.homepageSections();
  sections.value = res.data.sort((a, b) => a.display_order - b.display_order);
}

async function update(section) {
  await adminApi.settings.updateHomepageSection(section.section_key, { title: section.title, subtitle: section.subtitle });
}

async function toggle(section, enabled) {
  section.enabled = enabled ? 1 : 0;
  await adminApi.settings.updateHomepageSection(section.section_key, { enabled });
}

onMounted(load);
</script>
