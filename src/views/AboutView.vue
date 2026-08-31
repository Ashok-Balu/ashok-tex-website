<template>
  <div class="pt-20 pb-16 bg-white">

    <!-- Hero -->
    <div class="bg-gradient-to-br from-ink-950 to-ink-800 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb :items="[{ name: 'About Us' }]" class="mb-8 [&_a]:text-white/60 [&_a:hover]:text-white [&_span]:text-white" />
        <div class="max-w-3xl">
          <p class="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-4">Established 1995 · Karur, Tamil Nadu</p>
          <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5">About Ashok Tex</h1>
          <p class="text-lg text-white/70 leading-relaxed">Rooted in Karur's textile heritage, we manufacture and supply premier cotton, woven, and recycled fabrics for domestic and international textile commerce.</p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      <!-- Story Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start pb-16 border-b border-surface-100">
        <div class="space-y-5">
          <h2 class="font-display text-3xl font-bold text-ink-900">The Legacy of Precision Weaving</h2>
          <p class="text-base text-ink-600 leading-relaxed">Founded in 1995 by <strong class="text-ink-900">Mr. Balusamy.M</strong> in Karur, Ashok Tex was built on a foundation of dependable manufacturing, accurate yarn selection, and long-term customer trust.</p>
          <p class="text-base text-ink-600 leading-relaxed">Karur is globally recognized as Tamil Nadu’s textile hub. Operating in the heart of this ecosystem allows us to combine specialized weaving expertise, skilled artisans, and efficient finishing processes to serve buyers across India and export markets.</p>
          <p class="text-base text-ink-600 leading-relaxed">Under the leadership of <strong class="text-ink-900">Mr. Arvinth.B</strong>, the company has expanded its production capabilities across yarn-dyed cottons, textured dobby fabrics, structural waffle weaves, and sustainable recycled textiles.</p>
          <blockquote class="border-l-4 border-brand-500 pl-5 py-2 bg-brand-50 rounded-r-xl">
            <p class="font-display text-lg italic text-ink-900">"Delivering dependable yardage with transparent specifications and enduring commercial value for every client."</p>
          </blockquote>
        </div>
        <div class="space-y-6">
          <div class="aspect-[4/3] rounded-3xl overflow-hidden shadow-section">
            <img :src="legacyImageUrl || 'https://images.unsplash.com/photo-1528747045269-390fe33c19f2?auto=format&fit=crop&w=1200&q=85'" :alt="legacyImageAlt" class="w-full h-full object-cover" />
          </div>
          <div class="bg-surface-50 rounded-2xl border border-surface-200 p-6">
            <h3 class="font-semibold text-ink-900 mb-4 text-sm">Corporate Profile</h3>
            <dl class="space-y-3 text-sm">
              <div v-for="fact in companyFacts" :key="fact.label" class="flex justify-between gap-4">
                <dt class="text-ink-500">{{ fact.label }}</dt>
                <dd class="font-medium text-ink-900 text-right">{{ fact.value }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>


      <div v-if="aboutGallery.length > 1" class="py-16 border-b border-surface-100">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <p class="section-label">Factory Moments</p>
          <h2 class="section-title">More From the Mill</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="(photo, i) in aboutGallery.slice(1)" :key="`${photo.url}-${i}`" class="rounded-3xl overflow-hidden border border-surface-200 bg-surface-50 shadow-section">
            <img :src="photo.url" :alt="photo.caption || 'Ashok Tex factory moment'" class="h-64 w-full object-cover" />
            <div v-if="photo.caption" class="px-4 py-3 text-sm text-ink-600">{{ photo.caption }}</div>
          </div>
        </div>
      </div>

      <!-- Management -->
      <div class="py-16 border-b border-surface-100">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <p class="section-label">Leadership</p>
          <h2 class="section-title">Our Management</h2>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div v-for="member in managementMembers" :key="member.name" class="bg-ink-900 rounded-3xl overflow-hidden shadow-card border border-surface-200">
            <div class="flex flex-col sm:flex-row items-center sm:items-stretch gap-0">
              <div class="sm:w-52 h-56 overflow-hidden shrink-0">
                <img :src="member.image" :alt="member.name" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 p-6 sm:p-7 text-white">
                <p class="text-base leading-relaxed text-white/80">{{ member.description }}</p>
                <h3 class="font-display text-2xl font-bold mt-5 text-white">Mr. {{ member.name?.replace(/^Mr\.?\s*/i, '') }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Principles -->
      <div class="py-16 border-b border-surface-100">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <p class="section-label">How We Work</p>
          <h2 class="section-title">Our Manufacturing Principles</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="(p, i) in principles" :key="i" class="bg-surface-50 rounded-2xl p-7 border border-surface-200 hover:shadow-card transition-all">
            <div class="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
              <span class="font-display font-bold text-brand-600 text-sm">0{{ i+1 }}</span>
            </div>
            <h3 class="font-display text-xl font-bold text-ink-900 mb-3">{{ p.title }}</h3>
            <p class="text-sm text-ink-600 leading-relaxed">{{ p.desc }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Breadcrumb from '../components/Breadcrumb.vue';
import { useCompany } from '../composables/useCompany';

const { company } = useCompany();

const defaultManagementMembers = [
  {
    name: 'M. Balusamy',
    role: 'Founder & Leadership',
    description: 'Known person in town for his weaving techniques, reliability, designing work and quality management. He has born and bought up from a weaving factory in his childhood days.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'B. Arvinth',
    role: 'Business & Finance',
    description: 'Once after his studies he joined the business. From then till now he has full experience in business and He is looking after merchandising and finance and accounts.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
  },
];

const companyFacts = computed(() => [
  { label: 'Legal Entity', value: company.value?.businessType || 'Sole Proprietorship' },
  { label: 'Established', value: String(company.value?.establishedYear || '1995') },
  { label: 'Founder', value: `Mr. ${company.value?.founder?.replace(/^Mr\.?\s*/i, '') || ''}` },
  { label: 'Key Executive', value: `Mr. ${company.value?.contactPerson?.replace(/^Mr\.?\s*/i, '') || ''}` },
  { label: 'GSTIN', value: company.value?.gstin || '' },
  { label: 'Location', value: `${company.value?.address?.city || ''}, ${company.value?.address?.state || ''}` },
  { label: 'Market', value: company.value?.marketCovered || 'Pan-India' },
]);

const managementMembers = computed(() => {
  const members = company.value?.managementMembers;
  if (Array.isArray(members) && members.length) {
    return members.filter((member) => member && (member.name || member.description || member.image));
  }
  return defaultManagementMembers;
});

const aboutGallery = computed(() => {
  const gallery = company.value?.aboutGallery;
  if (Array.isArray(gallery) && gallery.length) {
    return gallery.filter((photo) => photo && (photo.url || photo.caption));
  }
  return [];
});

const legacyImageUrl = computed(() => company.value?.legacyImage || aboutGallery.value[0]?.url || '');
const legacyImageAlt = computed(() => company.value?.legacyImageCaption || aboutGallery.value[0]?.caption || 'Ashok Tex textile production facility');

const principles = [
  { title: 'Quality Consistency', desc: 'Every meter is monitored for yarn balance, loom tension, and finishing quality so buyers receive dependable performance from first sample to bulk production.' },
  { title: 'Customized Production', desc: 'We support fabric variations in weave, color, width, and finish to align with specific garment and industrial requirements.' },
  { title: 'Pan-India Distribution', desc: 'With a reliable Karur-based supply chain and direct communication channels, we ensure timely dispatch and consistent commercial support.' },
];
</script>
