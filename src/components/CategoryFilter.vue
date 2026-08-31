<template>
  <div class="flex flex-wrap items-center gap-2" role="group" aria-label="Category Filters">
    <button
      type="button"
      :class="[
        'px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 border',
        modelValue === 'All'
          ? 'bg-ink-900 border-ink-900 text-white shadow-sm'
          : 'bg-white border-surface-200 text-ink-600 hover:border-ink-300 hover:bg-surface-100'
      ]"
      @click="$emit('update:modelValue', 'All')"
    >
      All Fabrics
    </button>
    <button
      v-for="cat in categories"
      :key="cat.slug"
      type="button"
      :class="[
        'px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 border',
        modelValue === cat.slug
          ? 'bg-brand-500 border-brand-500 text-white shadow-sm'
          : 'bg-white border-surface-200 text-ink-600 hover:border-brand-300 hover:bg-brand-50/50'
      ]"
      @click="$emit('update:modelValue', cat.slug)"
    >
      {{ cat.name }}
    </button>
  </div>
</template>

<script setup>
import { useCategoryFlat } from '../composables/useCategories';

const { flat: categories } = useCategoryFlat();
defineProps({ modelValue: { type: String, default: 'All' } });
defineEmits(['update:modelValue']);
</script>

