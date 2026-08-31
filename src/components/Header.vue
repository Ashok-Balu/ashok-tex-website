<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-surface-200 py-3'
        : isHome
          ? 'bg-transparent py-5'
          : 'bg-white border-b border-surface-200 py-3'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 group" @click="closeMobileMenu">
        <div class="flex flex-col">
          <span :class="['font-display font-bold text-xl sm:text-2xl tracking-tight transition-colors leading-none', isScrolled || !isHome ? 'text-ink-900' : 'text-white']">
            Ashok Tex
          </span>
          <span :class="['text-[10px] font-medium tracking-widest uppercase transition-colors leading-none mt-0.5', isScrolled || !isHome ? 'text-brand-600' : 'text-brand-300']">
            Est. 1995 · Karur
          </span>
        </div>
      </router-link>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-1" aria-label="Main navigation">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150',
            isActive(item.path)
              ? (isScrolled || !isHome ? 'bg-brand-50 text-brand-700 font-semibold' : 'bg-white/15 text-white font-semibold')
              : (isScrolled || !isHome ? 'text-ink-600 hover:text-ink-900 hover:bg-surface-100' : 'text-white/85 hover:text-white hover:bg-white/10')
          ]"
        >
          {{ item.name }}
        </router-link>
      </nav>

      <!-- Desktop CTA -->
      <div class="hidden md:flex items-center gap-3">
        <a
          :href="phoneHref"
          :class="['text-sm font-medium transition-colors', isScrolled || !isHome ? 'text-ink-600 hover:text-ink-900' : 'text-white/80 hover:text-white']"
        >
          {{ phoneDisplay }}
        </a>
        <router-link
          to="/request-quote"
          class="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Get a Quote
        </router-link>
      </div>

      <!-- Mobile Hamburger -->
      <button
        type="button"
        :class="['md:hidden p-2 rounded-lg transition-colors', isScrolled || !isHome ? 'text-ink-700 hover:bg-surface-100' : 'text-white hover:bg-white/10']"
        :aria-expanded="mobileMenuOpen"
        aria-label="Toggle menu"
        @click="toggleMobileMenu"
      >
        <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile Menu Drawer -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-3"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-3"
    >
      <div v-if="mobileMenuOpen" class="md:hidden bg-white border-b border-surface-200 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-4 space-y-1">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            :class="[
              'block px-4 py-3 rounded-xl text-sm font-medium transition-all',
              isActive(item.path)
                ? 'bg-brand-50 text-brand-700 font-semibold'
                : 'text-ink-700 hover:bg-surface-100'
            ]"
            @click="closeMobileMenu"
          >
            {{ item.name }}
          </router-link>
        </div>
        <div class="px-4 pb-4 pt-2 border-t border-surface-100 space-y-2">
          <router-link
            to="/request-quote"
            class="w-full block text-center py-3 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-all"
            @click="closeMobileMenu"
          >
            Get a Quote
          </router-link>
          <a
            :href="phoneHref"
            class="w-full block text-center py-2.5 border border-surface-300 text-ink-700 text-sm font-medium rounded-xl hover:bg-surface-50 transition-all"
          >
            Call: {{ phoneDisplay }}
          </a>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNavigation } from '../composables/useNavigation';
import { useCompany } from '../composables/useCompany';

const route = useRoute();
const isScrolled = ref(false);
const mobileMenuOpen = ref(false);

const { items: navigationItems } = useNavigation();
const { company } = useCompany();

const navItems = computed(() => navigationItems.value.map((item) => ({ name: item.label, path: item.link })));
const phoneDisplay = computed(() => company.value?.phone || '+91 7904154775');
const phoneHref = computed(() => `tel:${company.value?.phoneRaw || '+917904154775'}`);

const isHome = computed(() => route.path === '/');

const isActive = (path) => {
  if (path === '/') return route.path === '/';
  if (path === '/collections') return route.path.startsWith('/collections');
  if (path === '/products') return route.path.startsWith('/products');
  return route.path === path;
};

const handleScroll = () => { isScrolled.value = window.scrollY > 40; };
const toggleMobileMenu = () => { mobileMenuOpen.value = !mobileMenuOpen.value; };
const closeMobileMenu = () => { mobileMenuOpen.value = false; };

onMounted(() => { window.addEventListener('scroll', handleScroll); handleScroll(); });
onUnmounted(() => { window.removeEventListener('scroll', handleScroll); });
</script>