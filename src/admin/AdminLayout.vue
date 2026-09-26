<template>
  <div class="admin-shell min-h-screen flex flex-col lg:flex-row bg-surface-50 text-ink-900">
    <!-- Mobile Menu Toggle -->
    <div class="lg:hidden flex items-center justify-between bg-white text-ink-900 p-4 border-b border-surface-200 shadow-sm">
      <router-link to="/admin" class="font-display font-bold text-lg">Ashok Tex</router-link>
      <button type="button" @click="sidebarOpen = !sidebarOpen" class="p-2 hover:bg-surface-100 rounded-lg">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="!sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Sidebar Overlay (Mobile) -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-brand-900/20 z-40 lg:hidden" @click="sidebarOpen = false"></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'admin-sidebar bg-white text-ink-900 flex flex-col transition-all duration-300 z-50 lg:z-auto border-r border-surface-200',
        'w-64 shrink-0 fixed lg:static inset-y-0 left-0 lg:inset-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <div class="px-6 py-6 border-b border-surface-200 hidden lg:block">
        <router-link to="/admin" class="font-display font-bold text-xl">Ashok Tex</router-link>
        <p class="text-xs text-brand-400 font-medium mt-0.5">Admin CMS</p>
      </div>
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <router-link
          v-for="item in navItems" :key="item.to" :to="item.to"
          @click="sidebarOpen = false"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
          :class="isActive(item.to) ? 'bg-brand-50 text-brand-700 shadow-sm' : 'text-ink-600 hover:bg-surface-100 hover:text-ink-900'"
        >
          <component :is="item.icon" class="w-4 h-4 shrink-0" />
          <span class="admin-nav-label">{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="admin-account-footer px-3 py-4 border-t border-surface-200">
        <div class="flex items-center gap-3 rounded-2xl bg-brand-50/80 border border-brand-100 p-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
            <CircleUserRound class="h-5 w-5" />
          </div>
          <div class="min-w-0">
            <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-700">Admin account</p>
            <p class="mt-0.5 truncate text-sm font-semibold text-ink-800">{{ user?.username || 'Administrator' }}</p>
          </div>
          <span class="ml-auto h-2 w-2 shrink-0 rounded-full bg-emerald-500" title="Online"></span>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-2">
          <router-link to="/" class="flex items-center justify-center gap-1.5 rounded-xl border border-surface-200 bg-white py-2 text-xs font-semibold text-ink-600 transition-colors hover:border-brand-200 hover:text-brand-700">
            <ExternalLink class="h-3.5 w-3.5" />
            Website
          </router-link>
          <button type="button" class="flex items-center justify-center gap-1.5 rounded-xl bg-surface-100 py-2 text-xs font-semibold text-ink-600 transition-colors hover:bg-surface-200 hover:text-ink-900" @click="handleLogout">
            <LogOut class="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </aside>

    <!-- Content -->
    <main class="flex-1 min-w-0 w-full">
      <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <router-view :key="$route.fullPath" />
      </div>
    </main>

    <div class="admin-notifications fixed right-4 top-4 z-[100] w-[min(24rem,calc(100vw-2rem))] space-y-3 sm:right-6 sm:top-6" aria-live="polite" aria-atomic="false">
      <transition-group name="toast" tag="div" class="space-y-3">
        <article v-for="notification in notifications" :key="notification.id" :class="['admin-toast', notification.type === 'error' ? 'admin-toast--error' : 'admin-toast--success']" :role="notification.type === 'error' ? 'alert' : 'status'">
          <span class="admin-toast__icon">
            <AlertCircle v-if="notification.type === 'error'" class="h-5 w-5" />
            <CheckCircle2 v-else class="h-5 w-5" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="admin-toast__title">{{ notification.type === 'error' ? 'Action needed' : 'Saved' }}</p>
            <p class="admin-toast__message">{{ notification.message }}</p>
          </div>
          <button type="button" class="admin-toast__close" aria-label="Dismiss notification" @click="dismiss(notification.id)"><X class="h-4 w-4" /></button>
          <span class="admin-toast__progress" :style="{ animationDuration: `${notification.duration}ms` }"></span>
        </article>
      </transition-group>
    </div>

    <Teleport to="body">
      <div v-if="confirmation" class="admin-confirm-backdrop" @click.self="resolveConfirmation(false)">
        <section class="admin-confirm" role="alertdialog" aria-modal="true" aria-labelledby="admin-confirm-title" aria-describedby="admin-confirm-message" tabindex="-1" @keydown.esc="resolveConfirmation(false)">
          <div class="admin-confirm__icon"><AlertTriangle class="h-6 w-6" /></div>
          <div>
            <h2 id="admin-confirm-title" class="admin-confirm__title">{{ confirmation.title }}</h2>
            <p id="admin-confirm-message" class="admin-confirm__message">{{ confirmation.message }}</p>
          </div>
          <div class="admin-confirm__actions">
            <button type="button" class="admin-confirm__cancel" @click="resolveConfirmation(false)">Cancel</button>
            <button type="button" class="admin-confirm__delete" @click="resolveConfirmation(true)"><Trash2 class="h-4 w-4" />{{ confirmation.confirmText }}</button>
          </div>
        </section>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AlertCircle, AlertTriangle, BarChart3, Building2, CheckCircle2, CircleUserRound, ExternalLink, FolderTree, Globe, Inbox, LogOut, MessageSquareQuote, Package, Trash2, X } from 'lucide-vue-next';
import { useAdminAuth } from '../composables/useAdminAuth';
import { useAdminNotifications } from '../composables/useAdminNotifications';
import { useAdminConfirm } from '../composables/useAdminConfirm';

const route = useRoute();
const router = useRouter();
const { user, logout } = useAdminAuth();
const { notifications, dismiss } = useAdminNotifications();
const { confirmation, resolveConfirmation } = useAdminConfirm();
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
  background-image: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,250,242,0.96));
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
  background: #fff7ed !important;
  color: #9a3412 !important;
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
  .admin-shell {
    min-width: 0;
  }

  .admin-shell main {
    min-width: 0;
  }

  .admin-shell main > div {
    padding: 1rem 0.75rem 1.25rem;
    overflow-x: hidden;
  }

  .admin-sidebar {
    width: min(18rem, 82vw);
  }

  .admin-shell table {
    min-width: 620px;
  }

  .admin-shell h1 {
    font-size: 1.65rem;
  }
}

.admin-account-footer {
  background: linear-gradient(180deg, rgba(255,255,255,0), rgba(255,247,237,0.7));
}

.admin-toast {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  overflow: hidden;
  border: 1px solid #e7e5e4;
  border-radius: 0.75rem;
  padding: 0.9rem 0.85rem 1rem;
  background: rgba(255,255,255,0.98);
  color: #292524;
  box-shadow: 0 18px 45px -24px rgba(41, 37, 36, 0.45), 0 4px 12px rgba(41, 37, 36, 0.08);
  backdrop-filter: blur(14px);
}

.admin-toast--success { border-left: 3px solid #059669; }
.admin-toast--error { border-left: 3px solid #dc2626; }
.admin-toast__icon { display: flex; flex: 0 0 auto; color: #059669; }
.admin-toast--error .admin-toast__icon { color: #dc2626; }
.admin-toast__title { margin: 0 0 0.15rem; font-size: 0.78rem; font-weight: 700; }
.admin-toast__message { margin: 0; color: #57534e; font-size: 0.78rem; line-height: 1.45; overflow-wrap: anywhere; }
.admin-toast__close { display: flex; flex: 0 0 auto; border-radius: 0.4rem; padding: 0.2rem; color: #78716c; transition: background 150ms, color 150ms; }
.admin-toast__close:hover { background: #f5f5f4; color: #292524; }
.admin-toast__progress { position: absolute; bottom: 0; left: 0; height: 2px; width: 100%; background: #059669; transform-origin: left; animation: toast-countdown linear forwards; }
.admin-toast--error .admin-toast__progress { background: #dc2626; }

.admin-confirm-backdrop { position: fixed; inset: 0; z-index: 120; display: grid; place-items: center; padding: 1rem; background: rgba(17, 24, 39, 0.48); backdrop-filter: blur(4px); }
.admin-confirm { display: grid; grid-template-columns: auto 1fr; gap: 1rem; width: min(100%, 27rem); border: 1px solid rgba(231, 229, 228, 0.9); border-radius: 0.9rem; padding: 1.35rem; background: #fff; box-shadow: 0 28px 80px -32px rgba(15, 23, 42, 0.55); animation: confirm-enter 160ms ease-out both; }
.admin-confirm__icon { display: grid; width: 2.7rem; height: 2.7rem; place-items: center; border-radius: 0.75rem; background: #fef2f2; color: #dc2626; }
.admin-confirm__title { margin: 0.1rem 0 0.35rem; color: #1c1917; font-size: 1rem; font-weight: 700; }
.admin-confirm__message { margin: 0; color: #57534e; font-size: 0.875rem; line-height: 1.5; overflow-wrap: anywhere; }
.admin-confirm__actions { grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 0.65rem; padding-top: 0.5rem; }
.admin-confirm__cancel, .admin-confirm__delete { display: inline-flex; min-height: 2.5rem; align-items: center; justify-content: center; gap: 0.45rem; border-radius: 0.6rem; padding: 0.55rem 0.9rem; font-size: 0.82rem; font-weight: 650; transition: background 150ms, transform 150ms; }
.admin-confirm__cancel { border: 1px solid #e7e5e4; background: #fff; color: #44403c; }
.admin-confirm__cancel:hover { background: #f5f5f4; }
.admin-confirm__delete { background: #dc2626; color: #fff; }
.admin-confirm__delete:hover { transform: translateY(-1px); background: #b91c1c; }
.toast-enter-active, .toast-leave-active { transition: opacity 180ms ease, transform 180ms ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-8px) translateX(8px); }
.toast-leave-active { position: absolute; right: 0; left: 0; }
@keyframes toast-countdown { to { transform: scaleX(0); } }
@keyframes confirm-enter { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

@media (max-width: 375px) {
  .admin-shell main > div {
    padding-left: 0.6rem;
    padding-right: 0.6rem;
  }

  .admin-shell .admin-notifications {
    right: 0.5rem;
    left: auto;
    width: min(24rem, calc(100vw - 1rem));
  }
}
</style>
