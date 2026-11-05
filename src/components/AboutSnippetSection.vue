<template>
  <section class="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(232,130,12,0.06),_transparent_28rem),linear-gradient(180deg,#fffefa_0%,#fffdf8_100%)] py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div class="space-y-6">
          <p class="section-label">{{ subtitle || 'Heritage & Capability' }}</p>
          <h2 class="section-title">{{ title || 'Three Decades of Weaving Excellence in Karur.' }}</h2>
          <p class="section-body">Established in 1995 by <strong class="text-ink-900">Mr. Balusamy.M</strong>, Ashok Tex has grown into a respected textile manufacturer in Karur, Tamil Nadu — delivering consistent quality, custom yardage, and reliable pan-India dispatch.</p>

          <div class="grid grid-cols-2 gap-4 py-2">
            <div v-for="stat in aboutStats" :key="stat.label" class="rounded-[1.4rem] border border-[#f2e2c0] bg-white/85 p-5 shadow-[0_18px_40px_-28px_rgba(44,29,14,0.3)]">
              <p class="font-display text-2xl font-bold text-ink-900">{{ stat.value }}</p>
              <p class="mt-1 text-xs font-medium text-ink-500">{{ stat.label }}</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-3 pt-2">
            <router-link to="/about" class="btn-primary">Our Company Story →</router-link>
            <router-link to="/why-ashok-tex" class="btn-secondary">Why Choose Us</router-link>
          </div>
        </div>

        <div class="relative">
          <div class="overflow-hidden rounded-[2rem] border border-[#f0dfc2] bg-white p-3 shadow-[0_30px_60px_-30px_rgba(36,23,14,0.3)]">
            <div class="aspect-[3/2] overflow-hidden rounded-[1.5rem]">
              <img src="/images/home/heritage-capability-collage.jpeg" alt="Ashok Tex weaving facility, modern looms, and woven fabrics" class="h-full w-full object-cover" loading="lazy" />
            </div>
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
