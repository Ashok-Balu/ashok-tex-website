<template>
  <div class="admin-login min-h-screen flex items-center justify-center bg-ink-950 px-4 py-8 sm:py-12">
    <div class="w-full max-w-5xl grid lg:grid-cols-[1.05fr_0.95fr] bg-white rounded-[2rem] shadow-float overflow-hidden">
      <div class="hidden lg:flex relative overflow-hidden bg-brand-500 p-12 text-white flex-col justify-between min-h-[590px]">
        <div class="relative z-10"><p class="text-xs font-bold uppercase tracking-[0.24em] text-white/65">Ashok Tex / Studio</p><h2 class="font-display text-5xl font-bold leading-tight mt-6">Shape the<br /><span class="text-ink-950">next collection.</span></h2><p class="text-white/75 max-w-sm mt-5 leading-relaxed">A calm space to manage your fabrics, stories, customer conversations, and the details behind the storefront.</p></div>
        <div class="relative z-10 flex items-center gap-3 text-sm text-white/80"><ShieldCheck class="w-5 h-5" /> Protected admin workspace</div>
        <div class="absolute -right-28 -bottom-32 w-96 h-96 rounded-full border border-white/20"></div><div class="absolute right-14 bottom-14 w-40 h-40 rounded-full border border-ink-950/15"></div>
      </div>
      <div class="p-7 sm:p-12 lg:p-14 flex items-center">
        <div class="w-full max-w-sm mx-auto">
          <div class="mb-9">
            <div class="w-12 h-12 rounded-2xl bg-ink-950 text-white flex items-center justify-center font-display text-lg font-bold mb-6">AT</div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-2">Welcome back</p>
            <h1 class="font-display text-3xl font-bold text-ink-950">Admin CMS Login</h1>
            <p class="text-sm text-ink-500 mt-2">Sign in to keep the Ashok Tex storefront moving.</p>
          </div>

          <div v-if="error" class="p-3.5 mb-5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700" role="alert">{{ error }}</div>

          <form class="space-y-5" @submit.prevent="handleLogin">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">Username</label>
              <input v-model="username" type="text" required class="input-field !py-3.5" autocomplete="username" placeholder="Enter your username" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">Password</label>
              <input v-model="password" type="password" required class="input-field !py-3.5" autocomplete="current-password" placeholder="Enter your password" />
            </div>
            <button type="submit" :disabled="loading" class="w-full py-3.5 bg-brand-500 hover:bg-brand-600 disabled:bg-ink-300 text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/15">
              {{ loading ? 'Signing in…' : 'Sign in to workspace' }}<ArrowRight v-if="!loading" class="w-4 h-4" />
            </button>
          </form>
          <p class="text-center text-xs text-ink-400 mt-8">Ashok Tex · Karur, Tamil Nadu</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ArrowRight, ShieldCheck } from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import { useAdminAuth } from '../../composables/useAdminAuth';

const route = useRoute();
const router = useRouter();
const { login } = useAdminAuth();

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function handleLogin() {
  loading.value = true;
  error.value = '';
  try {
    await login(username.value.trim(), password.value);
    router.push(route.query.redirect || '/admin');
  } catch (e) {
    error.value = e.message || 'Login failed.';
  } finally {
    loading.value = false;
  }
}
</script>
