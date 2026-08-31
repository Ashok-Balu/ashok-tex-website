<template>
  <div class="relative w-full max-w-md">
    <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
    <input
      :value="modelValue"
      type="text"
      placeholder="Search fabrics by name, category..."
      class="w-full pl-10 pr-10 py-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent focus:bg-white transition-all"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button v-if="modelValue" type="button" class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400 hover:text-ink-700 transition-colors" aria-label="Clear" @click="$emit('update:modelValue', '')">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  </div>
</template>

<script setup>
defineProps({ modelValue: { type: String, default: '' } });
defineEmits(['update:modelValue']);
</script>
