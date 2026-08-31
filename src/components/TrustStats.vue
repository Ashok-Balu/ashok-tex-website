<template>
  <section class="bg-surface-50 border-y border-surface-200 py-12" aria-label="Company Statistics">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="title" class="text-center max-w-2xl mx-auto mb-10">
        <p v-if="subtitle" class="section-label">{{ subtitle }}</p>
        <h2 class="section-title">{{ title }}</h2>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <div v-for="stat in stats" :key="stat.label" class="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-card border border-surface-100">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" :class="stat.iconBg">
            <svg class="w-6 h-6" :class="stat.iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.icon"/></svg>
          </div>
          <div>
            <p class="font-display text-2xl font-bold text-ink-900 leading-none">{{ stat.value }}</p>
            <p class="text-xs text-ink-500 mt-1 font-medium">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useCompany } from '../composables/useCompany';
import { useCategoryFlat } from '../composables/useCategories';

defineProps({ title: { type: String, default: '' }, subtitle: { type: String, default: '' } });

const { company } = useCompany();
const { flat: categories } = useCategoryFlat();

const stats = computed(() => [
  {
    value: company.value?.establishedYear || '1995',
    label: `Established in ${company.value?.address?.city || 'Karur'}`,
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    iconBg: 'bg-brand-50', iconColor: 'text-brand-600',
  },
  {
    value: categories.value.length ? `${categories.value.length}+` : '3+',
    label: 'Core fabric collections',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    iconBg: 'bg-purple-50', iconColor: 'text-purple-600',
  },
  {
    value: 'GST',
    label: `Registered business (${company.value?.gstin || '—'})`,
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    iconBg: 'bg-green-50', iconColor: 'text-green-600',
  },
  {
    value: company.value?.marketCovered || 'Pan-India',
    label: 'Wholesale supply reach',
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: 'bg-sky-50', iconColor: 'text-sky-600',
  },
]);
</script>
