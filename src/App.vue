<template>
  <div class="min-h-screen flex flex-col bg-white text-ink-900">
    <div v-if="apiLoading" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-[1px]">
      <div class="flex items-center gap-3 rounded-full bg-white/90 px-5 py-3 shadow-xl border border-surface-200">
        <svg class="h-5 w-5 animate-spin text-brand-600" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4Z" />
        </svg>
        <span class="text-sm font-semibold text-ink-700">Loading...</span>
      </div>
    </div>

    <Header v-if="!isAdminRoute" />
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <template v-if="!isAdminRoute">
      <MobileBottomBar />
      <Footer />

      <!-- Floating WhatsApp Button (desktop) -->
      <a
        :href="whatsappUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-2.5 px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-full shadow-float transition-all hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
        WhatsApp Us
      </a>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import MobileBottomBar from './components/MobileBottomBar.vue';
import { injectStructuredData, getOrganizationSchema } from './utils/schema';
import { useCompany } from './composables/useCompany';
import { apiLoading, api } from './services/api';

const route = useRoute();
const isAdminRoute = computed(() => !!route.meta?.isAdmin);
const { company } = useCompany();
const whatsappUrl = computed(() => {
  const number = company.value?.whatsappNumber || '917904154775';
  return `https://wa.me/${number}?text=Hello%20Ashok%20Tex%2C%20I%20am%20interested%20in%20your%20fabric%20products.`;
});

function updateHeadMeta() {
  const currentCompany = company.value || {};
  const routeTitle = route.meta?.title || 'Ashok Tex | Textile Fabric Manufacturer';
  const routeDescription = route.meta?.description || 'Ashok Tex textile fabric manufacturer and wholesale supplier in Karur, Tamil Nadu.';

  const title = currentCompany.name && route.meta?.isAdmin !== true
    ? `${currentCompany.name} | ${routeTitle.replace(/^.*\|\s*/, '')}`.replace(/\s{2,}/g, ' ')
    : routeTitle;

  const description = currentCompany.tagline || routeDescription;

  document.title = title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', description);

  const setMeta = (attribute, value, content) => {
    let element = document.head.querySelector(`meta[${attribute}="${value}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, value);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  if (currentCompany.website) setMeta('property', 'og:url', currentCompany.website);
}

watch(company, (val) => {
  if (val) injectStructuredData(getOrganizationSchema(val), 'org-json-ld');
  updateHeadMeta();
}, { immediate: true });

watch(() => route.fullPath, () => updateHeadMeta(), { immediate: true });

onMounted(() => {
  if (route.meta?.isAdmin) return;

  const visitorKey = 'ashoktex_visitor_session';
  let sessionId = localStorage.getItem(visitorKey);
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(visitorKey, sessionId);
  }

  api.analytics.visit({
    sessionId,
    path: route.fullPath,
    referrer: document.referrer || '',
    userAgent: navigator.userAgent,
  }).catch(() => {});
});
</script>