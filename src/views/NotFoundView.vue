<template>
  <div class="min-h-screen flex items-center justify-center bg-white py-20">
    <div class="max-w-lg mx-auto px-4 text-center">
      <div class="w-24 h-24 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
        <svg class="w-12 h-12 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      </div>
      <p class="text-brand-600 text-sm font-semibold uppercase tracking-widest mb-3">Error 404</p>
      <h1 class="font-display text-4xl sm:text-5xl font-bold text-ink-900 mb-4">Page Not Found</h1>
      <p class="text-base text-ink-500 leading-relaxed mb-10">The page you're looking for doesn't exist or has been moved. Explore our fabric catalog or return home.</p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <router-link to="/" class="btn-primary w-full sm:w-auto justify-center">Return Home</router-link>
        <router-link to="/products" class="btn-secondary w-full sm:w-auto justify-center">View All Fabrics</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
