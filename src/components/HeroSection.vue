<template>
  <section class="relative min-h-screen flex items-center bg-ink-950 text-white overflow-hidden">

    <!-- Background fabric image -->
    <div class="absolute inset-0">
      <img
        src="/powerloom-fabric.jpg"
        alt="Close-up of checkered powerloom fabric"
        class="w-full h-full object-cover object-center opacity-65"
        loading="eager"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/65 to-ink-950/5"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-ink-950/20"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
      <div class="max-w-3xl">

        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
          <span class="w-2 h-2 rounded-full bg-brand-400 animate-pulse-slow"></span>
          <span class="text-xs font-medium text-white/80 tracking-wide">{{ company?.address?.city || 'Karur' }} Textile Hub · Est. {{ company?.establishedYear || '1995' }} · GST: {{ company?.gstin || '—' }}</span>
        </div>

        <!-- Headline -->
        <h1 class="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] mb-6">
          Textiles That<br>
          <span class="text-brand-400">Move Business</span><br>
          Forward.
        </h1>

        <!-- Subtext -->
        <p class="text-lg sm:text-xl text-white/70 max-w-xl leading-relaxed mb-10">
          Quality cotton, woven & recycled fabrics direct from our Karur mill. Wholesale supply for garment manufacturers and brands across India.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap gap-4">
          <router-link to="/collections" class="px-7 py-3.5 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-brand-500/30 hover:shadow-xl">
            Explore Collections
          </router-link>
          <router-link to="/request-quote" class="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/25 hover:border-white/40 transition-all duration-200 backdrop-blur-sm">
            Request a Quote
          </router-link>
          <a href="https://wa.me/917904154775" target="_blank" rel="noopener" class="px-7 py-3.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 font-semibold rounded-xl border border-green-600/30 hover:border-green-500/50 transition-all duration-200 backdrop-blur-sm flex items-center gap-2">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            WhatsApp
          </a>
        </div>

        <!-- Trust stats -->
        <div class="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-white/10">
          <div v-for="stat in stats" :key="stat.label" class="text-center sm:text-left">
            <p class="font-display text-2xl font-bold text-white">{{ stat.value }}</p>
            <p class="text-xs text-white/50 mt-0.5 uppercase tracking-wider font-medium">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/40 animate-bounce">
      <span class="text-[10px] uppercase tracking-widest">Scroll</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useCompany } from '../composables/useCompany';
import { useCategoryFlat } from '../composables/useCategories';

const { company } = useCompany();
const { flat: categories } = useCategoryFlat();

const stats = computed(() => [
  { value: company.value?.establishedYear || '1995', label: 'Established' },
  { value: company.value?.address?.city || 'Karur', label: company.value?.address?.state || 'Tamil Nadu' },
  { value: company.value?.marketCovered || 'Pan-India', label: 'Supply Reach' },
  { value: categories.value.length ? `${categories.value.length}+ Fabrics` : '8+ Fabrics', label: 'Product Range' },
]);
</script>
