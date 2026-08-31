<template>
  <div class="text-center py-20 px-6">
    <div class="w-16 h-16 mx-auto bg-surface-100 rounded-2xl flex items-center justify-center text-ink-400 mb-5">
      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    </div>
    <h3 class="font-display text-xl font-semibold text-ink-900 mb-2">{{ title }}</h3>
    <p class="text-sm text-ink-500 max-w-sm mx-auto mb-6">{{ message }}</p>
    <button v-if="actionText" type="button" class="btn-primary" @click="$emit('action')">
      {{ actionText }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'No Products Found' },
  message: { type: String, default: 'Try adjusting your search or filter selection.' },
  actionText: { type: String, default: 'Clear Search' },
});
defineEmits(['action']);
</script>
