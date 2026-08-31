<template>
  <section class="py-20 bg-white" aria-labelledby="custom-fabric-heading">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="max-w-2xl mb-14">
        <p class="section-label">{{ subtitle || 'Tailored B2B Manufacturing' }}</p>
        <h2 id="custom-fabric-heading" class="section-title mb-4">{{ title || 'Fabric, Your Way.' }}</h2>
        <p class="section-body">Whether you need standardized catalog varieties or custom yarn counts, weaves, and widths, Ashok Tex provides precision manufacturing direct from Karur.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div v-for="(feature, i) in features" :key="i" class="bg-surface-50 rounded-2xl p-7 border border-surface-200 hover:border-brand-300 hover:shadow-card-hover transition-all duration-300 group">
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-5', feature.iconBg]">
            <svg :class="['w-6 h-6', feature.iconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.icon"/></svg>
          </div>
          <h3 class="font-display text-xl font-semibold text-ink-900 mb-2 group-hover:text-brand-700 transition-colors">{{ feature.title }}</h3>
          <p class="text-sm text-ink-500 leading-relaxed mb-4">{{ feature.desc }}</p>
          <p class="text-xs font-medium text-ink-400">{{ feature.tags }}</p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-brand-50 rounded-2xl border border-brand-100">
        <div>
          <p class="font-semibold text-ink-900 text-sm">Have custom requirements?</p>
          <p class="text-sm text-ink-500 mt-0.5">Share your target specifications, sample patterns, or desired GSM.</p>
        </div>
        <router-link to="/request-quote" class="btn-brand shrink-0">
          Submit Requirements →
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({ title: { type: String, default: '' }, subtitle: { type: String, default: '' } });

const features = [
  {
    title: 'Custom Weaves & Textures',
    desc: 'From dimensional waffle honeycomb pockets and micro-dobbies to crisp yarn-dyed checks, we calibrate looms to produce your required visual structure.',
    tags: 'Dobby · Waffle · Checks · Stripes',
    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    iconBg: 'bg-brand-100', iconColor: 'text-brand-600',
  },
  {
    title: 'Standard & Sustainable Yarns',
    desc: 'Choose from 100% virgin combed cotton or certified regenerated recycled yarns for flexible options from premium touch to circular sustainability.',
    tags: '100% Cotton · Recycled Blends',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    iconBg: 'bg-green-50', iconColor: 'text-green-600',
  },
  {
    title: 'Direct Mill Transparency',
    desc: 'No middleman markups. Receive fast bulk quotations, sample swatch dispatch, transparent lead times, and direct founder communication.',
    tags: 'MOQ 2,500m · Direct Pricing',
    icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    iconBg: 'bg-sky-50', iconColor: 'text-sky-600',
  },
];
</script>
