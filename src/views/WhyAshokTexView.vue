<template>
  <div class="pt-20 pb-16 bg-white">

    <!-- Hero -->
    <div class="bg-gradient-to-br from-ink-950 to-ink-800 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb :items="[{ name: 'Why Ashok Tex' }]" class="mb-8 [&_a]:text-white/60 [&_a:hover]:text-white [&_span]:text-white" />
        <div class="max-w-3xl">
          <p class="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-4">The Ashok Tex Advantage</p>
          <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">Why Choose Ashok Tex?</h1>
          <p class="text-lg text-white/70 leading-relaxed">Direct manufacturing reliability, three decades of Karur textile expertise, and verified commercial consistency for brands and garment manufacturers.</p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div v-for="(item, i) in advantages" :key="i" class="bg-surface-50 rounded-2xl p-7 border border-surface-200 hover:shadow-card-hover hover:border-brand-200 transition-all duration-300 group">
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-5', item.iconBg]">
            <svg :class="['w-6 h-6', item.iconColor]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"/></svg>
          </div>
          <h2 class="font-display text-xl font-bold text-ink-900 mb-3 group-hover:text-brand-700 transition-colors">{{ item.title }}</h2>
          <p class="text-sm text-ink-600 leading-relaxed mb-5">{{ item.desc }}</p>
          <p class="text-xs font-semibold text-ink-400">{{ item.tag }}</p>
        </div>
      </div>

      <div class="bg-ink-900 rounded-3xl overflow-hidden mb-16">
        <div class="p-8 sm:p-10">
          <p class="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-3">Manufacturing Advantage</p>
          <h2 class="font-display text-3xl font-bold text-white mb-8">Why Buyers Choose Ashok Tex</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-ink-200">
            <div v-for="row in comparisonRows" :key="row.title" class="rounded-2xl border border-ink-700 bg-white/5 p-5">
              <p class="font-semibold text-white mb-2">{{ row.title }}</p>
              <p class="leading-relaxed text-ink-300">{{ row.text }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import Breadcrumb from '../components/Breadcrumb.vue';

const advantages = [
  { title: 'Experience Since 1995', desc: 'With roots in Karur, we bring decades of weaving knowledge, consistency and trusted commercial relationships.', tag: '30 Years Craftsmanship', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', iconBg: 'bg-brand-100', iconColor: 'text-brand-600' },
  { title: 'Direct Mill Sourcing', desc: 'No middlemen, no hidden layers. Buyers get transparent pricing, faster updates and direct factory communication.', tag: 'Transparent Pricing', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', iconBg: 'bg-sky-50', iconColor: 'text-sky-600' },
  { title: 'Fabric Variety', desc: 'Our range includes cotton, dobby, waffle, stripe, and recycled textile variants suited for practical and premium applications.', tag: 'Multi-Material Range', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z', iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
  { title: 'Quality Focus', desc: 'We follow defined inspection criteria for strength, consistency, finishing, and yarn behavior before dispatch.', tag: 'Rigorous Checking', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', iconBg: 'bg-green-50', iconColor: 'text-green-600' },
];

const comparisonRows = [
  { title: 'Real-time Communication', text: 'Buyers speak directly with the team, making approvals, sample requests and order updates faster and clearer.' },
  { title: 'Responsible Production', text: 'Our recycled and cotton fabric range supports buyers who need reliable performance with a more sustainable sourcing option.' },
  { title: 'Commercial Flexibility', text: 'We work with practical MOQs and commercial terms that suit wholesalers, job workers and bulk textile buyers.' },
  { title: 'Logistics Support', text: 'From Karur, we coordinate dispatches efficiently across Tamil Nadu and pan-India supply channels.' },
];
</script>
