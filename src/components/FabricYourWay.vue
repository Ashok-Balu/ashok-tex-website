<template>
  <section class="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(232,130,12,0.07),_transparent_32rem),linear-gradient(180deg,#fffdf8_0%,#fffaf3_100%)] py-20" aria-labelledby="custom-fabric-heading">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-14 max-w-2xl">
        <p class="section-label">{{ subtitle || 'Tailored B2B Manufacturing' }}</p>
        <h2 id="custom-fabric-heading" class="section-title mb-4">{{ title || 'Fabric, Your Way.' }}</h2>
        <p class="section-body">Whether you need standardized catalog varieties or custom yarn counts, weaves, and widths, Ashok Tex provides precision manufacturing direct from Karur.</p>
      </div>

      <div class="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div v-for="(feature, i) in features" :key="i" class="group rounded-[1.7rem] border border-[#f0dfc2] bg-white/85 p-7 shadow-[0_20px_45px_-28px_rgba(55,34,20,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_24px_60px_-30px_rgba(55,34,20,0.35)]">
          <div :class="['mb-5 flex h-12 w-12 items-center justify-center rounded-2xl', feature.iconBg]">
            <svg :class="['h-6 w-6', feature.iconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.icon"/></svg>
          </div>
          <h3 class="mb-2 font-display text-xl font-semibold text-ink-900 transition-colors group-hover:text-brand-700">{{ feature.title }}</h3>
          <p class="mb-4 text-sm leading-relaxed text-ink-500">{{ feature.desc }}</p>
          <p class="text-xs font-medium uppercase tracking-[0.12em] text-ink-400">{{ feature.tags }}</p>
        </div>
      </div>

      <div class="flex flex-col items-center justify-between gap-4 rounded-[1.8rem] border border-[#f0dfc2] bg-[linear-gradient(135deg,_rgba(255,248,238),_rgba(255,255,255))] p-6 shadow-[0_20px_50px_-32px_rgba(52,34,18,0.32)] sm:flex-row">
        <div>
          <p class="text-sm font-semibold text-ink-900">Have custom requirements?</p>
          <p class="mt-0.5 text-sm text-ink-500">Share your target specifications, sample patterns, or desired GSM.</p>
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
