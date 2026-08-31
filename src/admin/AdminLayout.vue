<template>
  <div class="admin-shell min-h-screen flex flex-col lg:flex-row bg-surface-50 text-ink-900">
    <!-- Mobile Menu Toggle -->
    <div class="lg:hidden flex items-center justify-between bg-ink-950 text-white p-4 border-b border-white/10">
      <router-link to="/admin" class="font-display font-bold text-lg">Ashok Tex</router-link>
      <button type="button" @click="sidebarOpen = !sidebarOpen" class="p-2 hover:bg-white/10 rounded-lg">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Sidebar Overlay (Mobile) -->
    <div v-if="sidebarOpen && window.innerWidth < 1024" class="fixed inset-0 bg-black/50 z-40 lg:hidden" @click="sidebarOpen = false"></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'admin-sidebar bg-ink-950 text-white flex flex-col transition-all duration-300 z-50 lg:z-auto',
        'w-64 shrink-0 fixed lg:static inset-y-0 left-0 lg:inset-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="px-6 py-6 border-b border-white/10 hidden lg:block">
        <router-link to="/admin" class="font-display font-bold text-xl">Ashok Tex</router-link>
        <p class="text-xs text-brand-400 font-medium mt-0.5">Admin CMS</p>
      </div>
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <router-link
          v-for="item in navItems" :key="item.to" :to="item.to"
          @click="sidebarOpen = false"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
          :class="isActive(item.to) ? 'bg-brand-500 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'"
        >
          <component :is="item.icon" class="w-4 h-4 shrink-0" />
          <span class="admin-nav-label">{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="px-4 py-4 border-t border-white/10">
        <p class="text-xs text-white/50 mb-2">Signed in as <strong class="text-white/80 truncate block">{{ user?.username }}</strong></p>
        <button type="button" class="w-full py-2 text-sm font-semibold rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs sm:text-sm" @click="handleLogout">Log Out</button>
        <router-link to="/" class="block text-center mt-2 text-xs text-white/50 hover:text-white/80">← Back to Website</router-link>
      </div>
    </aside>

    <!-- Content -->
    <main class="flex-1 min-w-0 w-full">
      <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <router-view />
      </div>
    </main>

    <div class="admin-notifications fixed bottom-5 right-5 z-[100] w-[min(24rem,calc(100vw-2rem))] space-y-3" aria-live="polite" aria-atomic="true">
      <transition-group name="toast" tag="div" class="space-y-3">
        <div v-for="notification in notifications" :key="notification.id" :class="['admin-toast flex items-start gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl border shadow-xl text-xs sm:text-sm', notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-white border-emerald-200 text-ink-800']" role="status">
          <CheckCircle2 v-if="notification.type !== 'error'" class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0 mt-0.5" />
          <AlertCircle v-else class="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0 mt-0.5" />
          <p class="font-medium leading-5 flex-1">{{ notification.message }}</p>
          <button type="button" class="text-current/50 hover:text-current" aria-label="Dismiss notification" @click="dismiss(notification.id)"><X class="w-3 h-3 sm:w-4 sm:h-4" /></button>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AlertCircle, BarChart3, Building2, CheckCircle2, FolderTree, Globe, Inbox, MessageSquareQuote, Package, X } from 'lucide-vue-next';
import { useAdminAuth } from '../composables/useAdminAuth';
import { useAdminNotifications } from '../composables/useAdminNotifications';

const route = useRoute();
const router = useRouter();
const { user, logout } = useAdminAuth();
const { notifications, dismiss } = useAdminNotifications();
const sidebarOpen = ref(false);

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: BarChart3 },
  { label: 'Categories', to: '/admin/categories', icon: FolderTree },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Testimonials', to: '/admin/testimonials', icon: MessageSquareQuote },
  { label: 'Enquiries', to: '/admin/enquiries', icon: Inbox },
  { label: 'Company Settings', to: '/admin/company', icon: Building2 },
  { label: 'Social & SEO', to: '/admin/social', icon: Globe },
];

function isActive(to) {
  return to === '/admin' ? route.path === '/admin' : route.path.startsWith(to);
}

function handleLogout() {
  logout();
  router.push('/admin/login');
}

onMounted(() => {
  sidebarOpen.value = false;
});
</script>

<style>
.admin-shell {
  background-image: radial-gradient(circle at 85% 0%, rgba(234, 88, 12, 0.07), transparent 28rem);
}

.admin-sidebar {
  background-image: linear-gradient(145deg, rgba(255,255,255,0.025), transparent 45%), radial-gradient(circle at 0% 100%, rgba(234,88,12,0.18), transparent 18rem);
}

.admin-shell main {
  background-color: rgba(250, 250, 249, 0.82);
  min-height: 100vh;
}

.admin-shell main > div > div:first-child {
  animation: admin-page-in 320ms ease-out both;
}

.admin-shell h1 {
  letter-spacing: -0.02em;
}

.admin-shell table {
  min-width: 680px;
}

.admin-shell table th {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.admin-shell table td {
  line-height: 1.45;
}

.admin-shell .overflow-x-auto {
  scrollbar-color: #cbd5e1 transparent;
  scrollbar-width: thin;
}

.admin-shell button.bg-brand-500,
.admin-shell a.bg-brand-500 {
  box-shadow: 0 8px 18px rgba(234, 88, 12, 0.16);
}

.admin-shell button.bg-brand-500:hover,
.admin-shell a.bg-brand-500:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(234, 88, 12, 0.22);
}

.admin-shell input[type='checkbox'] {
  accent-color: #ea580c;
}

.admin-shell .fixed.inset-0 > div {
  animation: admin-modal-in 180ms ease-out both;
}

@keyframes admin-page-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes admin-modal-in {
  from { opacity: 0; transform: translateY(10px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.admin-shell table thead {
  background: #111827 !important;
  color: rgba(255, 255, 255, 0.7) !important;
  letter-spacing: 0.02em;
}

.admin-shell table tbody tr {
  transition: background-color 150ms ease, box-shadow 150ms ease;
}

.admin-shell table tbody tr:hover {
  background-color: rgba(255, 247, 237, 0.7);
}

.admin-shell .bg-white {
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.045);
}

.admin-shell .input-field:focus {
  box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.1);
}

.toast-enter-active,
.toast-leave-active { transition: opacity 180ms ease, transform 180ms ease; }
.toast-enter-from,
.toast-leave-to { opacity: 0; transform: translateY(10px) translateX(12px); }

@media (max-width: 640px) {
  .admin-sidebar {
    width: 4.25rem;
  }

  .admin-sidebar > div:first-child {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    text-align: center;
  }

  .admin-sidebar > div:first-child .font-display {
    font-size: 0;
  }

  .admin-sidebar > div:first-child .font-display::after {
    content: 'AT';
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.15rem;
  }

  .admin-sidebar > div:first-child p,
  .admin-sidebar .admin-nav-label,
  .admin-sidebar > div:last-child {
    display: none;
  }

  .admin-sidebar nav {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .admin-sidebar nav a {
    justify-content: center;
    padding-left: 0.7rem;
    padding-right: 0.7rem;
  }

  .admin-shell main > div {
    padding: 1.25rem 0.9rem;
  }

  .admin-shell table {
    min-width: 620px;
  }

  .admin-shell h1 {
    font-size: 1.65rem;
  }
}
</style>
