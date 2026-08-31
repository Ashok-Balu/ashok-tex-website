<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
        <div>
          <p class="section-label">{{ subtitle || 'Client Feedback' }}</p>
          <h2 class="section-title">{{ title || 'What Buyers Say' }}</h2>
        </div>
        <div v-if="testimonials.length > 1" class="hidden sm:flex gap-2 shrink-0">
          <button
            class="w-10 h-10 flex items-center justify-center rounded-full border border-surface-200 text-ink-500 hover:text-brand-600 hover:border-brand-300 transition-colors"
            aria-label="Previous testimonials"
            @click="scrollByStep(-1)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button
            class="w-10 h-10 flex items-center justify-center rounded-full border border-surface-200 text-ink-500 hover:text-brand-600 hover:border-brand-300 transition-colors"
            aria-label="Next testimonials"
            @click="scrollByStep(1)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      <div
        v-if="testimonials.length"
        ref="track"
        class="testimonial-track flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
        @mouseenter="stop"
        @mouseleave="start"
      >
        <div
          v-for="t in testimonials" :key="t.id"
          class="snap-start shrink-0 w-[85%] sm:w-[47%] lg:w-[31.5%] xl:w-[23%] bg-surface-50 rounded-2xl p-7 border border-surface-200 hover:shadow-card transition-all"
        >
          <div class="flex gap-1 mb-4">
            <svg v-for="i in (t.rating || 5)" :key="i" class="w-4 h-4 text-brand-500 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <p class="text-sm text-ink-700 italic leading-relaxed mb-5">"{{ t.quote }}"</p>
          <p class="text-sm font-semibold text-ink-900">{{ t.customerName }}</p>
          <p class="text-xs text-ink-500 mt-0.5">{{ t.role }}</p>
        </div>
      </div>

      <!-- Mobile arrows -->
      <div v-if="testimonials.length > 1" class="flex sm:hidden justify-center gap-3 mt-6">
        <button class="w-10 h-10 flex items-center justify-center rounded-full border border-surface-200 text-ink-500" aria-label="Previous testimonials" @click="scrollByStep(-1)">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button class="w-10 h-10 flex items-center justify-center rounded-full border border-surface-200 text-ink-500" aria-label="Next testimonials" @click="scrollByStep(1)">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      <div class="text-center mt-10">
        <router-link to="/testimonials" class="text-sm font-semibold text-brand-600 hover:text-brand-700">View all testimonials →</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useTestimonials } from '../composables/useTestimonials';

defineProps({ title: { type: String, default: '' }, subtitle: { type: String, default: '' } });

const { testimonials } = useTestimonials();
const track = ref(null);

function cardStep() {
  const el = track.value;
  if (!el || !el.firstElementChild) return 320;
  const style = getComputedStyle(el);
  return el.firstElementChild.offsetWidth + parseFloat(style.columnGap || style.gap || 24);
}

function scrollByStep(direction) {
  const el = track.value;
  if (!el) return;
  const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
  if (direction > 0 && atEnd) {
    el.scrollTo({ left: 0, behavior: 'smooth' });
    return;
  }
  el.scrollBy({ left: direction * cardStep(), behavior: 'smooth' });
}

let timer = null;
function start() {
  stop();
  if (testimonials.value.length > 1) timer = setInterval(() => scrollByStep(1), 4000);
}
function stop() {
  if (timer) { clearInterval(timer); timer = null; }
}

onMounted(start);
onUnmounted(stop);
</script>

<style scoped>
.testimonial-track::-webkit-scrollbar { display: none; }
.testimonial-track { scrollbar-width: none; -ms-overflow-style: none; }
</style>
