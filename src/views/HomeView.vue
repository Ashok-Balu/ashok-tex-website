<template>
  <div>
    <HeroSection v-if="isEnabled('hero')" />

    <component
      :is="sectionComponents[key]"
      v-for="key in orderedKeys"
      :key="key"
      :title="sectionMap[key]?.title"
      :subtitle="sectionMap[key]?.subtitle"
    />

    <FabricTextureShowcase />

    <!-- Contact Strip -->
    <section class="py-12 bg-ink-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div v-for="info in contactInfo" :key="info.label" class="flex items-start gap-4">
            <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="info.icon"/></svg>
            </div>
            <div class="min-w-0">
              <p class="text-xs text-brand-400 font-semibold uppercase tracking-wider mb-1">{{ info.label }}</p>
              <p class="text-sm text-white/80 leading-relaxed break-words" v-html="info.content"></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useHomepageSections } from '../composables/useHomepageSections';
import { useCompany } from '../composables/useCompany';
import HeroSection from '../components/HeroSection.vue';
import TrustStats from '../components/TrustStats.vue';
import FabricYourWay from '../components/FabricYourWay.vue';
import CollectionsShowcase from '../components/CollectionsShowcase.vue';
import FeaturedProductsSection from '../components/FeaturedProductsSection.vue';
import AboutSnippetSection from '../components/AboutSnippetSection.vue';
import TestimonialsSection from '../components/TestimonialsSection.vue';
import EnquirySection from '../components/EnquirySection.vue';
import FabricTextureShowcase from '../components/FabricTextureShowcase.vue';

// Maps each admin-configurable homepage_sections.section_key to the component that renders it.
// 'hero' is handled separately above since it's always the page header.
const sectionComponents = {
  trust_stats: TrustStats,
  categories: CollectionsShowcase,
  featured_products: FeaturedProductsSection,
  why_choose_us: FabricYourWay,
  about: AboutSnippetSection,
  testimonials: TestimonialsSection,
  enquiry: EnquirySection,
};

const { sections } = useHomepageSections();
const { company } = useCompany();

const sectionMap = computed(() => Object.fromEntries(sections.value.map((s) => [s.section_key, s])));

function isEnabled(key) {
  const section = sectionMap.value[key];
  return !section || !!section.enabled;
}

// Renders admin-managed sections (excluding hero) in the order/enabled state configured in Admin > Homepage Sections.
const orderedKeys = computed(() => sections.value
  .filter((s) => sectionComponents[s.section_key] && s.enabled)
  .sort((a, b) => a.display_order - b.display_order)
  .map((s) => s.section_key));

const contactInfo = computed(() => [
]);
</script>
