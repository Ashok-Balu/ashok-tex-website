<template>
  <div class="space-y-4">
    <!-- Main Image -->
    <div
      class="relative aspect-square bg-surface-100 rounded-2xl overflow-hidden group cursor-zoom-in"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
      @click="openFullscreen"
    >
      <img
        :src="currentImage"
        :alt="altText"
        class="w-full h-full object-cover transition-transform duration-200"
        :style="zoomStyle"
        loading="eager"
      />
      <div class="absolute bottom-3 right-3 px-3 py-1.5 bg-ink-900/70 backdrop-blur-sm text-white text-xs font-medium rounded-lg opacity-70 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/></svg>
        Click to enlarge
      </div>
      <div class="absolute top-3 right-3 sm:hidden px-2.5 py-1 bg-white/90 text-ink-800 text-xs font-semibold rounded-lg">
        {{ activeIndex + 1 }} / {{ normalizedImages.length || 0 }}
      </div>
    </div>

    <!-- Thumbnails -->
    <div v-if="normalizedImages.length > 1" class="grid grid-cols-4 gap-3">
      <button
        v-for="(img, idx) in normalizedImages"
        :key="idx"
        type="button"
        :class="['aspect-square rounded-xl overflow-hidden border-2 transition-all', activeIndex === idx ? 'border-brand-500 ring-2 ring-brand-200' : 'border-transparent opacity-60 hover:opacity-100']"
        @click="activeIndex = idx"
      >
        <img :src="img" :alt="`View ${idx + 1}`" class="w-full h-full object-cover" />
      </button>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="isFullscreen" class="fixed inset-0 z-50 bg-ink-950/95 backdrop-blur-md flex items-center justify-center p-4" @click.self="closeFullscreen">
        <button type="button" class="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center transition-colors" @click="closeFullscreen">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <button v-if="normalizedImages.length > 1" type="button" class="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center transition-colors" @click.stop="prevImage">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button v-if="normalizedImages.length > 1" type="button" class="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center justify-center transition-colors" @click.stop="nextImage">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
        <div class="max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden">
          <img :src="currentImage" :alt="altText" class="max-w-full max-h-[85vh] object-contain rounded-2xl" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  images: { type: Array, required: true },
  altText: { type: String, default: 'Fabric Product Image' },
});

const activeIndex = ref(0);
const isFullscreen = ref(false);
const isZooming = ref(false);
const mouseX = ref(50);
const mouseY = ref(50);

const normalizedImages = computed(() =>
  (Array.isArray(props.images) ? props.images.map((image) => (typeof image === 'string' ? image : image?.url || image?.src || '')).filter(Boolean) : []),
);

const currentImage = computed(() => normalizedImages.value[activeIndex.value] || normalizedImages.value[0] || '');

const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  mouseX.value = ((e.clientX - rect.left) / rect.width) * 100;
  mouseY.value = ((e.clientY - rect.top) / rect.height) * 100;
  isZooming.value = true;
};
const handleMouseLeave = () => { isZooming.value = false; };
const zoomStyle = computed(() => isZooming.value ? { transformOrigin: `${mouseX.value}% ${mouseY.value}%`, transform: 'scale(1.8)' } : {});
const openFullscreen = () => { isFullscreen.value = true; };
const closeFullscreen = () => { isFullscreen.value = false; };
const nextImage = () => { if (!normalizedImages.value.length) return; activeIndex.value = (activeIndex.value + 1) % normalizedImages.value.length; };
const prevImage = () => { if (!normalizedImages.value.length) return; activeIndex.value = (activeIndex.value - 1 + normalizedImages.value.length) % normalizedImages.value.length; };
</script>
