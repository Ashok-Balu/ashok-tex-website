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

// Maps each admin-configurable homepage_sections.section_key to the component that renders it.
// 'hero' is handled separately above since it's always the page header.
const sectionComponents = {
  trust_stats: TrustStats,
  categories: CollectionsShowcase,
  featured_products: FeaturedProductsSection,
  why_choose_us: FabricYourWay,
  about: AboutSnippetSection,
  testimonials: TestimonialsSection,
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

</script>
