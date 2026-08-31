<template>
  <nav class="flex items-center text-sm text-ink-500" aria-label="Breadcrumb">
    <ol class="flex items-center flex-wrap gap-1.5">
      <li class="flex items-center">
        <router-link to="/" class="hover:text-ink-900 transition-colors font-medium">Home</router-link>
      </li>
      <li v-for="(item, idx) in items" :key="idx" class="flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5 text-ink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <router-link v-if="item.path" :to="item.path" class="hover:text-ink-900 transition-colors font-medium">{{ item.name }}</router-link>
        <span v-else class="text-ink-800 font-semibold truncate max-w-[200px]">{{ item.name }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({ items: { type: Array, required: true } });
</script>
