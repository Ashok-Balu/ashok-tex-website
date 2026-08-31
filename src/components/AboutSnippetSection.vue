<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div class="space-y-6">
          <p class="section-label">{{ subtitle || 'Heritage & Capability' }}</p>
          <h2 class="section-title">{{ title || 'Three Decades of Weaving Excellence in Karur.' }}</h2>
          <p class="section-body">Established in 1995 by <strong class="text-ink-900">Mr. Balusamy.M</strong>, Ashok Tex has grown into a respected textile manufacturer in Karur, Tamil Nadu — delivering consistent quality, custom yardage, and reliable pan-India dispatch.</p>
          <div class="grid grid-cols-2 gap-4 py-2">
            <div v-for="stat in aboutStats" :key="stat.label" class="bg-surface-50 rounded-2xl p-5 border border-surface-200">
              <p class="font-display text-2xl font-bold text-ink-900">{{ stat.value }}</p>
              <p class="text-xs text-ink-500 mt-1 font-medium">{{ stat.label }}</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-3 pt-2">
            <router-link to="/about" class="btn-primary">Our Company Story →</router-link>
            <router-link to="/why-ashok-tex" class="btn-secondary">Why Choose Us</router-link>
          </div>
        </div>
        <div class="relative">
          <div class="aspect-[4/3] rounded-3xl overflow-hidden shadow-section">
            <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=85" alt="Ashok Tex Fabric Weaving" class="w-full h-full object-cover" loading="lazy" />
          </div>
          <div class="absolute -bottom-5 -left-5 bg-ink-900 text-white p-6 rounded-2xl shadow-float hidden sm:block max-w-56">
            <span class="font-display text-3xl font-bold text-brand-400 block">1995</span>
            <span class="text-xs text-white/60 mt-1 block">Continuous operation in Karur textile cluster</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useCompany } from '../composables/useCompany';

defineProps({ title: { type: String, default: '' }, subtitle: { type: String, default: '' } });

const { company } = useCompany();

const aboutStats = computed(() => company.value?.stats || [
  { value: '1995', label: 'Year Established' },
  { value: '30+', label: 'Years Experience' },
]);
</script>
