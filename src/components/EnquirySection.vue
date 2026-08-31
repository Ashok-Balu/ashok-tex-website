<template>
  <section class="py-20 bg-surface-50">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-10">
        <p class="section-label">{{ subtitle || 'B2B Inquiry & Bulk Sourcing' }}</p>
        <h2 class="section-title">{{ title || 'Request a Quote' }}</h2>
      </div>
      <QuoteForm />
    </div>
  </section>
</template>

<script setup>
import QuoteForm from './QuoteForm.vue';

defineProps({ title: { type: String, default: '' }, subtitle: { type: String, default: '' } });
</script>
