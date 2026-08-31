<template>
  <section class="py-16 bg-surface-50" aria-labelledby="cta-heading">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-br from-ink-900 to-ink-800 rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-float">
        <div class="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/4"></div>

        <div class="relative z-10 max-w-2xl">
          <h2 id="cta-heading" class="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Ready to source quality fabrics direct from Karur?
          </h2>
          <p class="text-white/70 text-base leading-relaxed mb-10">
            We partner with garment manufacturers, apparel exporters, institutional wholesalers, and fashion brands across India with reliable bulk supply and direct mill pricing.
          </p>
          <div class="flex flex-wrap gap-4">
            <router-link to="/request-quote" class="px-7 py-3.5 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-xl transition-all shadow-lg text-sm">
              Request a Quote →
            </router-link>
            <a href="https://wa.me/917904154775?text=Hello%20Ashok%20Tex%2C%20I%20am%20interested%20in%20sourcing%20fabrics." target="_blank" rel="noopener" class="px-7 py-3.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 font-semibold rounded-xl border border-green-500/30 transition-all text-sm flex items-center gap-2">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              WhatsApp
            </a>
            <a href="tel:+917904154775" class="px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-semibold rounded-xl border border-white/10 transition-all text-sm">
              Call +91 7904154775
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>
