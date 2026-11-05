<template>
  <section
    class="hero-stage relative flex items-center overflow-hidden bg-[#211811] text-white"
    aria-roledescription="carousel"
    aria-label="Ashok Tex fabric collections"
  >
    <div class="absolute inset-0" aria-hidden="true">
      <img
        v-for="(slide, index) in slides"
        :key="slide.image"
        :src="slide.image"
        sizes="100vw"
        :alt="slide.alt"
        :class="['hero-image absolute inset-0 h-full w-full object-cover object-center', { 'is-active': index === activeIndex }]"
        :loading="index === 0 ? 'eager' : 'lazy'"
        :fetchpriority="index === 0 ? 'high' : 'auto'"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-[#160f0a]/90 via-[#1b120d]/65 to-[#1b120d]/15"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(232,130,12,0.25),_transparent_26rem)]"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#140f0d]/85 via-transparent to-[#140f0d]/25"></div>
    </div>

    <div class="hero-content relative z-10 mx-auto grid min-h-[calc(100svh-6.75rem)] w-full max-w-7xl content-center gap-8 px-4 pb-12 pt-16 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10 lg:px-8 lg:pb-24 lg:pt-32">
      <div class="max-w-4xl">
        <div class="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black/20 px-4 py-2.5 backdrop-blur-md">
          <span class="h-2 w-2 rounded-full bg-brand-400 shadow-[0_0_14px_rgba(251,146,60,0.8)]"></span>
          <span class="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85">{{ company?.address?.city || 'Karur' }} Textile Hub · Est. {{ company?.establishedYear || '1995' }}</span>
        </div>

        <Transition name="slide-copy" mode="out-in">
          <div :key="activeSlide.title" aria-live="polite">
            <p class="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">{{ activeSlide.eyebrow }}</p>
            <h1 class="mb-6 max-w-4xl font-display text-5xl font-bold leading-[0.98] text-white sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              {{ activeSlide.title }}
              <span class="block text-brand-300">{{ activeSlide.highlight }}</span>
            </h1>
            <p class="mb-9 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              {{ activeSlide.description }}
            </p>
          </div>
        </Transition>

        <div class="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
          <router-link to="/collections" class="inline-flex w-full items-center justify-center whitespace-nowrap rounded-xl bg-brand-500 px-2.5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_35px_-10px_rgba(232,130,12,0.8)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-400 hover:shadow-[0_18px_35px_-8px_rgba(232,130,12,0.95)] sm:w-auto sm:px-6">
            Explore Collections <span aria-hidden="true">→</span>
          </router-link>
          <router-link to="/request-quote" class="inline-flex w-full items-center justify-center whitespace-nowrap rounded-xl border border-[#d89a75] bg-[#9f4933] px-2.5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_-12px_rgba(116,43,26,0.8)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#873b29] sm:w-auto sm:px-6">
            Request a Quote
          </router-link>
          <a href="https://wa.me/917904154775" target="_blank" rel="noopener noreferrer" class="col-span-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-green-400/40 bg-green-700/90 px-2.5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-700 sm:col-span-1 sm:w-auto sm:px-6">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.3-4.8A8.5 8.5 0 1 1 20.5 11.8Z" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 8.5c.4 2.2 2.7 4.5 5 5l1.2-1.2 2 .9c-.1 1.2-.9 2-2.1 2-3.4-.3-6.7-3.6-7-7 0-1.2.8-2 2-2.1l.9 2-1.2 1.2Z" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            WhatsApp Us
          </a>
        </div>

        <div class="mt-8 grid max-w-3xl grid-cols-2 gap-x-5 gap-y-4 border-t border-white/20 pt-5 sm:grid-cols-4 sm:gap-6 lg:mt-12 lg:pt-6">
          <div v-for="stat in stats" :key="stat.label">
            <p class="font-display text-xl font-bold text-white sm:text-2xl">{{ stat.value }}</p>
            <p class="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.17em] text-white/55">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <div class="hero-controls flex items-end justify-between gap-5 lg:w-[20rem] lg:flex-col lg:items-stretch lg:justify-end">
        <div class="flex items-center gap-3 text-white/70">
          <span class="font-display text-3xl font-semibold text-white">{{ String(activeIndex + 1).padStart(2, '0') }}</span>
          <span class="h-px w-10 bg-white/35"></span>
          <span class="text-xs">{{ String(slides.length).padStart(2, '0') }}</span>
          <span class="ml-1 max-w-28 text-[10px] font-semibold uppercase tracking-[0.15em]">{{ activeSlide.label }}</span>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" class="hero-arrow" aria-label="Previous slide" @click="showPrevious">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m15 18-6-6 6-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button type="button" class="hero-arrow" aria-label="Next slide" @click="showNext">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
        <div class="flex gap-2 lg:grid lg:grid-cols-5">
          <button
            v-for="(slide, index) in slides"
            :key="slide.label"
            type="button"
            :aria-label="`Show ${slide.label} slide`"
            :aria-current="index === activeIndex ? 'true' : undefined"
            :class="['hero-thumbnail', { 'is-active': index === activeIndex }]"
            @click="goToSlide(index)"
          >
            <img :src="slide.image" :alt="''" loading="lazy" />
            <span>{{ slide.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="hero-scroll-cue absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-white/50 sm:flex">
      <span class="text-[9px] uppercase tracking-[0.28em]">Scroll to explore</span>
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M19 9l-7 7-7-7"/></svg>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useCompany } from '../composables/useCompany';
import { useCategoryFlat } from '../composables/useCategories';

const { company } = useCompany();
const { flat: categories } = useCategoryFlat();
const slides = [
  {
    image: '/images/home/textile-color-weave.webp',
    alt: 'Colorful woven textiles showing varied patterns and fabric textures',
    label: 'Color Weave',
    eyebrow: 'Color and character in every weave',
    title: 'Color That’s',
    highlight: 'Woven to Life.',
    description: 'Explore expressive yarn-dyed color and dependable fabric quality, ready for your next collection.',
  },
  {
    image: '/images/home/loom-with-cloth.webp',
    alt: 'A traditional weaving machine with fabric on the loom',
    label: 'Loom Craft',
    eyebrow: 'Made with care, thread by thread',
    title: 'The Craft Behind',
    highlight: 'Every Thread.',
    description: 'See the craft behind a reliable fabric supply, built around consistency, quality, and lasting partnerships.',
  },
  {
    image: '/images/home/artisan-weaving.webp',
    alt: 'A textile artisan working at a weaving machine',
    label: 'Weaving',
    eyebrow: 'Skill shaped by generations',
    title: 'Crafted by Hand,',
    highlight: 'Made for Business.',
    description: 'A closer look at the people and process behind distinctive woven textiles.',
  },
  {
    image: '/images/home/weaving-machine-detail.webp',
    alt: 'Close detail of a weaving machine and textile in production',
    label: 'In Production',
    eyebrow: 'Precision in every pass',
    title: 'Thoughtful Detail,',
    highlight: 'Consistent Quality.',
    description: 'Careful weaving and dependable quality from the first thread to the finished fabric.',
  },
  {
    image: '/images/home/textile-thread-spools.webp',
    alt: 'Textile threads and yarn spools ready for fabric production',
    label: 'Yarn & Thread',
    eyebrow: 'Quality starts with the yarn',
    title: 'Strong Foundations',
    highlight: 'In Every Fiber.',
    description: 'Thoughtfully selected yarns bring depth, color, and consistency to every textile we make.',
  },
];
const activeIndex = ref(0);
const activeSlide = computed(() => slides[activeIndex.value]);
let autoplayTimer;
let reducedMotion = false;

function goToSlide(index) {
  activeIndex.value = index;
}

function showNext() {
  activeIndex.value = (activeIndex.value + 1) % slides.length;
}

function showPrevious() {
  activeIndex.value = (activeIndex.value - 1 + slides.length) % slides.length;
}

const stats = computed(() => [
  { value: company.value?.establishedYear || '1995', label: 'Established' },
  { value: company.value?.address?.city || 'Karur', label: company.value?.address?.state || 'Tamil Nadu' },
  { value: company.value?.marketCovered || 'Pan-India', label: 'Supply Reach' },
  { value: categories.value.length ? `${categories.value.length}+ Fabrics` : '8+ Fabrics', label: 'Product Range' },
]);

onMounted(() => {
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion) autoplayTimer = window.setInterval(showNext, 6500);
});

onUnmounted(() => window.clearInterval(autoplayTimer));
</script>

<style scoped>
.hero-stage {
  min-height: calc(100svh - 6.75rem);
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
  animation: hero-fade-in 650ms ease-out both;
}

.hero-image {
  opacity: 0;
  transition: opacity 1100ms ease;
}

.hero-image.is-active {
  opacity: 1;
}

.hero-controls {
  animation: hero-fade-in 800ms 180ms ease-out both;
}

.hero-arrow {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: white;
  backdrop-filter: blur(10px);
  transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;
}

.hero-arrow:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.65);
  background: rgba(255, 255, 255, 0.18);
}

.hero-arrow:focus-visible,
.hero-thumbnail:focus-visible {
  outline: 2px solid #fdba74;
  outline-offset: 3px;
}

.hero-arrow svg {
  width: 1.25rem;
  height: 1.25rem;
}

.hero-thumbnail {
  position: relative;
  width: 5.5rem;
  height: 3.75rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 0.75rem;
  background: #251b13;
  opacity: 0.62;
  transition: opacity 180ms ease, border-color 180ms ease, transform 180ms ease;
}

.hero-thumbnail:hover,
.hero-thumbnail.is-active {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.85);
  opacity: 1;
}

.hero-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-thumbnail::after {
  position: absolute;
  inset: 35% 0 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.68));
  content: '';
}

.hero-thumbnail span {
  position: absolute;
  z-index: 1;
  right: 0.45rem;
  bottom: 0.35rem;
  left: 0.45rem;
  overflow: hidden;
  color: white;
  font-size: 9px;
  font-weight: 700;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slide-copy-enter-active,
.slide-copy-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}

.slide-copy-enter-from {
  transform: translateY(10px);
  opacity: 0;
}

.slide-copy-leave-to {
  transform: translateY(-8px);
  opacity: 0;
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
  .hero-content,
  .hero-controls {
    animation: none;
  }

  .hero-image,
  .slide-copy-enter-active,
  .slide-copy-leave-active {
    transition-duration: 0.01ms;
  }
}

@media (max-width: 639px) {
  .hero-stage {
    min-height: calc(100svh - 5.75rem);
  }

  .hero-content {
    min-height: calc(100svh - 5.75rem);
  }

  .hero-controls {
    width: 100%;
    flex-wrap: wrap;
  }

  .hero-controls > div:last-child {
    display: grid;
    flex: 0 0 100%;
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .hero-thumbnail {
    width: 100%;
    height: 3.25rem;
  }
}
</style>
