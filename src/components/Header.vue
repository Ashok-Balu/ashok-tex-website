<template>
  <header class="site-header relative z-50 px-3 pt-3 sm:px-5">
    <div class="relative mx-auto flex max-w-7xl items-center justify-between overflow-hidden rounded-[1.5rem] border border-[#f1ddbf] bg-[#fffdf9]/95 px-4 shadow-[0_18px_45px_-28px_rgba(81,48,24,0.42)] backdrop-blur-xl sm:px-5">
      <router-link to="/" class="group flex items-center gap-2.5 py-3" @click="closeMobileMenu">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-brand-500 text-sm font-bold text-white shadow-[0_15px_25px_-12px_rgba(232,130,12,0.8)] transition-transform duration-200 group-hover:rotate-3">AT</span>
        <div class="flex flex-col">
          <span class="font-display text-xl font-bold leading-none tracking-tight text-ink-900 sm:text-2xl">Ashok Tex</span>
          <span class="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-brand-600">Est. 1995 · Karur</span>
        </div>
      </router-link>

      <nav class="hidden items-center gap-1 md:flex" aria-label="Main navigation">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'nav-link relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200',
            isActive(item.path)
              ? 'is-active bg-brand-50 text-brand-700 font-semibold'
              : 'text-ink-600 hover:bg-surface-100 hover:text-ink-900'
          ]"
        >
          {{ item.name }}
        </router-link>
      </nav>

      <div class="hidden items-center gap-3 md:flex">
        <a :href="phoneHref" class="text-sm font-medium text-ink-600 transition-colors hover:text-brand-700">{{ phoneDisplay }}</a>
        <router-link to="/request-quote" class="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_24px_-12px_rgba(232,130,12,0.78)] transition-all duration-200 hover:bg-brand-600">Get a Quote</router-link>
      </div>

      <button type="button" class="rounded-lg p-2 text-ink-700 transition-colors hover:bg-surface-100 md:hidden" :aria-expanded="mobileMenuOpen" aria-label="Toggle menu" @click="toggleMobileMenu">
        <svg v-if="!mobileMenuOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-3" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-3">
      <div v-if="mobileMenuOpen" class="mx-auto mt-2 max-w-7xl overflow-hidden rounded-[1.4rem] border border-[#f1e0c3] bg-white shadow-[0_20px_40px_-25px_rgba(58,36,18,0.4)] md:hidden">
        <div class="space-y-1 px-4 py-4">
          <router-link v-for="item in navItems" :key="item.path" :to="item.path" :class="['block rounded-xl px-4 py-3 text-sm font-medium transition-all', isActive(item.path) ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-ink-700 hover:bg-surface-100']" @click="closeMobileMenu">{{ item.name }}</router-link>
        </div>
        <div class="space-y-2 border-t border-surface-100 px-4 pb-4 pt-2">
          <router-link to="/request-quote" class="block w-full rounded-xl bg-brand-500 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-brand-600" @click="closeMobileMenu">Get a Quote</router-link>
          <a :href="phoneHref" class="block w-full rounded-xl border border-surface-300 py-2.5 text-center text-sm font-medium text-ink-700 transition-all hover:bg-surface-50">Call: {{ phoneDisplay }}</a>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useNavigation } from '../composables/useNavigation';
import { useCompany } from '../composables/useCompany';

const route = useRoute();
const mobileMenuOpen = ref(false);

const { items: navigationItems } = useNavigation();
const { company } = useCompany();

const navOrder = ['/', '/collections', '/products', '/why-ashok-tex', '/about', '/request-quote', '/contact'];
const navItems = computed(() => navigationItems.value
  .map((item) => ({ name: item.label, path: item.link }))
  .sort((a, b) => navOrder.indexOf(a.path) - navOrder.indexOf(b.path)));
const phoneDisplay = computed(() => company.value?.phone || '+91 7904154775');
const phoneHref = computed(() => `tel:${company.value?.phoneRaw || '+917904154775'}`);

const isActive = (path) => {
  if (path === '/') return route.path === '/';
  if (path === '/collections') return route.path.startsWith('/collections');
  if (path === '/products') return route.path.startsWith('/products');
  return route.path === path;
};

const toggleMobileMenu = () => { mobileMenuOpen.value = !mobileMenuOpen.value; };
const closeMobileMenu = () => { mobileMenuOpen.value = false; };
</script>