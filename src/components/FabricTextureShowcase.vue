<template>
  <section class="py-20 bg-ink-950 text-white" aria-labelledby="textures-heading">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="max-w-2xl mb-12">
        <p class="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-3">Material Mastery</p>
        <h2 id="textures-heading" class="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Fabric Texture Showcase</h2>
        <p class="text-white/60 text-base leading-relaxed">Examine the dimensional depth, yarn alignments, and weave densities engineered on our powerlooms in Karur.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="texture in textures" :key="texture.title" class="group bg-ink-800 rounded-2xl overflow-hidden border border-ink-700 hover:border-brand-500 transition-all duration-300">
          <div class="aspect-square overflow-hidden">
            <img :src="texture.image" :alt="texture.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          </div>
          <div class="p-5">
            <p class="text-brand-400 text-[11px] font-semibold uppercase tracking-wider mb-1">{{ texture.type }}</p>
            <h3 class="font-display text-lg font-semibold text-white mb-2">{{ texture.title }}</h3>
            <p class="text-xs text-white/55 leading-relaxed">{{ texture.desc }}</p>
          </div>
        </div>
      </div>

      <div class="mt-10 text-center">
        <router-link to="/products" class="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-xl border border-white/15 transition-all">
          View All Products
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
const textures = [
  {
    title: 'Checkered Structure', type: 'Yarn-Dyed Grid',
    desc: 'Balanced warp & weft intersecting color channels delivering contrast and breathable comfort.',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Dobby Texture', type: 'Micro-Geometric',
    desc: 'Subtle geometric surface elevations by specialized dobby loom harnesses for luxury drape.',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Waffle Weave', type: '3D Honeycomb',
    desc: 'Three-dimensional recessed air pockets creating thermal insulation and high moisture absorption.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Striped Yardage', type: 'Linear Precision',
    desc: 'Sharp linear color bands woven with high warp tension for dimensional consistency.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
  },
];
</script>
