<template>
  <section class="hero-stage relative flex items-center overflow-hidden bg-brand-50 text-white">
    <div class="absolute inset-0">
      <img
        src="/powerloom-fabric.jpg"
        alt="Close-up of checkered powerloom fabric"
        class="h-full w-full object-cover object-center opacity-75"
        loading="eager"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-[#1a110d]/85 via-[#1b120d]/55 to-[#1b120d]/20"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(232,130,12,0.24),_transparent_24rem)]"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#140f0d]/80 via-transparent to-[#140f0d]/20"></div>
    </div>

    <div class="hero-content relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div class="max-w-4xl">
        <div class="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <span class="h-2.5 w-2.5 rounded-full bg-brand-400 animate-pulse-slow"></span>
          <span class="text-[11px] font-medium uppercase tracking-[0.18em] text-white/80">{{ company?.address?.city || 'Karur' }} Textile Hub · Est. {{ company?.establishedYear || '1995' }}</span>
        </div>

        <h1 class="mb-6 max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-[6rem]">
          Textiles That
          <span class="block text-brand-300">Move Business</span>
          <span class="block">Forward.</span>
        </h1>

        <p class="mb-10 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
          Quality cotton, woven & recycled fabrics direct from our Karur mill. Wholesale supply for garment manufacturers and brands across India.
        </p>

        <div class="flex flex-wrap gap-4">
          <router-link to="/collections" class="rounded-xl bg-brand-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_35px_-10px_rgba(232,130,12,0.8)] transition-all duration-200 hover:bg-brand-400 hover:shadow-[0_18px_35px_-8px_rgba(232,130,12,0.95)]">
            Explore Collections
          </router-link>
          <router-link to="/request-quote" class="rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20">
            Request a Quote
          </router-link>
          <a href="https://wa.me/917904154775" target="_blank" rel="noopener" class="flex items-center gap-2 rounded-xl border border-green-500/40 bg-green-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-950/20 transition-all duration-200 hover:bg-green-700">
            <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            WhatsApp
          </a>
        </div>

        <div class="mt-16 grid grid-cols-2 gap-4 pt-10 sm:grid-cols-4 sm:gap-6">
          <div v-for="stat in stats" :key="stat.label" class="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_35px_-25px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-5">
            <p class="font-display text-2xl font-bold text-white sm:text-3xl">{{ stat.value }}</p>
            <p class="mt-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="hero-scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/40">
      <span class="text-[10px] uppercase tracking-[0.28em]">Scroll</span>
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
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

<style scoped>
.hero-stage {
  min-height: 100vh;
  min-height: 100svh;
  isolation: isolate;
}

.hero-stage::after {
  position: absolute;
  inset: auto 0 0;
  height: 8rem;
  background: linear-gradient(to top, rgba(45, 25, 12, 0.34), transparent);
  content: '';
  pointer-events: none;
}

.hero-content {
  animation: hero-fade-in 420ms ease-out both;
}

.hero-scroll-cue {
  opacity: 0.8;
  transition: opacity 180ms ease;
}

.hero-scroll-cue:hover {
  opacity: 1;
}

@keyframes hero-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-content {
    animation: none;
  }
}
</style>
