<template>
  <div class="pt-20 pb-16 bg-white">

    <!-- Hero -->
    <div class="bg-gradient-to-br from-ink-950 to-ink-800 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb :items="[{ name: 'Testimonials' }]" class="mb-8 [&_a]:text-white/60 [&_a:hover]:text-white [&_span]:text-white" />
        <div class="max-w-2xl">
          <p class="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-4">What Customers Say</p>
          <h1 class="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Customer Testimonials</h1>
          <p class="text-white/70 text-base leading-relaxed">Feedback from garment manufacturers, textile wholesalers, and apparel buyers who trust Ashok Tex for their fabric sourcing needs.</p>
        </div>
      </div>
    </div>

    <!-- Testimonials Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <div
          v-for="t in testimonials"
          :key="t.id"
          class="bg-white rounded-3xl p-8 border border-surface-200 shadow-card hover:shadow-card-hover transition-all duration-300"
        >
          <!-- Stars -->
          <div class="flex gap-1 mb-5">
            <svg v-for="i in (t.rating || 5)" :key="i" class="w-4 h-4 fill-brand-500 text-brand-500" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>

          <!-- Quote -->
          <div class="mb-6">
            <svg class="w-8 h-8 text-brand-200 mb-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
            <p class="text-ink-700 leading-relaxed italic">"{{ t.quote }}"</p>
          </div>

          <!-- Author -->
          <div class="flex items-center gap-3 pt-5 border-t border-surface-100">
            <div class="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-brand-700 font-bold text-sm">{{ t.customerName.charAt(0) }}</span>
            </div>
            <div>
              <p class="text-sm font-semibold text-ink-900">{{ t.customerName }}</p>
              <p class="text-xs text-ink-500">{{ t.role }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="bg-surface-50 rounded-3xl border border-surface-200 p-10 text-center">
        <p class="section-label mx-auto">Join Our Clients</p>
        <h2 class="font-display text-3xl font-bold text-ink-900 mb-4">Become a Satisfied Customer</h2>
        <p class="text-ink-600 mb-8 max-w-xl mx-auto leading-relaxed">Experience the quality, reliability, and service that makes Ashok Tex the trusted choice for fabric procurement across India.</p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/request-quote" class="btn-brand">Request a Quote →</router-link>
          <router-link to="/products" class="btn-secondary">Explore Fabrics</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumb from '../components/Breadcrumb.vue';
import { useTestimonials } from '../composables/useTestimonials';

const { testimonials } = useTestimonials();
</script>
