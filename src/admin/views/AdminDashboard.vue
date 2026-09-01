<template>
  <div class="space-y-6">
    <div class="relative overflow-hidden rounded-3xl bg-ink-950 px-4 sm:px-6 lg:px-8 py-6 sm:py-7 lg:py-9 text-white">
      <div class="relative z-10">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-brand-400 mb-2 sm:mb-3">Ashok Tex / Control room</p>
        <h1 class="font-display text-2xl sm:text-3xl lg:text-4xl font-bold">Good to see you, {{ userName }}.</h1>
        <p class="text-xs sm:text-sm text-white/60 mt-2 sm:mt-3 max-w-lg">Keep the catalogue fresh, surface your strongest fabrics, and stay close to every buyer conversation.</p>
      </div>
      <div class="absolute -right-16 -top-20 w-64 h-64 rounded-full border border-white/10"></div>
    </div>

    <div v-if="stats" class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div v-for="card in cards" :key="card.label" class="bg-white rounded-2xl border border-surface-200 p-3 sm:p-5 relative overflow-hidden">
        <div class="flex items-start justify-between gap-2"><div><p class="text-xl sm:text-2xl font-bold text-ink-950">{{ card.value }}</p><p class="text-xs text-ink-500 mt-1 font-medium line-clamp-2">{{ card.label }}</p></div><component :is="card.icon" :class="['w-4 sm:w-5 h-4 sm:h-5 shrink-0', card.color]" /></div>
        <div :class="['absolute bottom-0 left-0 h-1 w-full', card.bar]"></div>
      </div>
    </div>

    <div v-if="stats?.visitors" class="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6 mb-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Website traffic</p>
          <h2 class="font-display text-xl sm:text-2xl font-bold text-ink-950 mt-1">Visitors overview</h2>
        </div>
        <Users class="w-4 sm:w-5 h-4 sm:h-5 text-indigo-500 shrink-0" />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="rounded-xl bg-indigo-50 border border-indigo-100 p-4">
          <p class="text-xs uppercase tracking-wide text-indigo-600 font-semibold">Unique visitors</p>
          <p class="mt-2 text-2xl font-bold text-ink-950">{{ stats.visitors.totalVisitors }}</p>
        </div>
        <div class="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
          <p class="text-xs uppercase tracking-wide text-emerald-600 font-semibold">Today</p>
          <p class="mt-2 text-2xl font-bold text-ink-950">{{ stats.visitors.visitsToday }}</p>
        </div>
        <div class="rounded-xl bg-amber-50 border border-amber-100 p-4">
          <p class="text-xs uppercase tracking-wide text-amber-600 font-semibold">Last 30 days</p>
          <p class="mt-2 text-2xl font-bold text-ink-950">{{ stats.visitors.visitsThisMonth }}</p>
        </div>
      </div>
      <div v-if="stats.visitors.topPages?.length" class="mt-4">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400 mb-2">Top pages</p>
        <ul class="space-y-2 text-sm text-ink-700">
          <li v-for="page in stats.visitors.topPages" :key="page.path" class="flex items-center justify-between gap-3 rounded-lg bg-surface-50 px-3 py-2">
            <span class="truncate">{{ page.path || '/' }}</span>
            <span class="font-semibold text-ink-900">{{ page.visits }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="stats" class="bg-white rounded-2xl border border-surface-200 p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">Catalogue pulse</p>
          <h2 class="font-display text-xl sm:text-2xl font-bold text-ink-950 mt-1">Most viewed products</h2>
        </div>
        <TrendingUp class="w-4 sm:w-5 h-4 sm:h-5 text-brand-500 shrink-0" />
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-xs sm:text-sm">
          <thead>
            <tr class="text-left text-ink-400 border-b border-surface-100">
              <th class="pb-2 font-medium">Product</th>
              <th class="pb-2 font-medium text-right whitespace-nowrap">Views</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-100">
            <tr v-for="p in stats.mostViewed" :key="p.id">
              <td class="py-2.5 text-ink-800"><span class="inline-flex w-5 sm:w-6 h-5 sm:h-6 mr-2 items-center justify-center rounded-lg bg-surface-100 text-xs font-bold text-ink-500">{{ stats.mostViewed.indexOf(p) + 1 }}</span><span class="truncate">{{ p.name }}</span></td>
              <td class="py-2.5 text-right text-ink-600 font-semibold whitespace-nowrap">{{ p.view_count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
      <router-link to="/admin/products/new" class="flex-1 sm:flex-none px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl inline-flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap">Add product <ArrowUpRight class="w-4 h-4 hidden sm:inline" /></router-link>
      <router-link to="/admin/categories" class="flex-1 sm:flex-none px-5 py-3 bg-white border border-surface-300 hover:bg-surface-50 text-ink-700 text-sm font-semibold rounded-xl inline-flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap">Manage categories <ArrowUpRight class="w-4 h-4 hidden sm:inline" /></router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ArrowUpRight, BarChart3, CheckCircle2, Eye, FolderTree, Inbox, Package, Star, TrendingUp, Users } from 'lucide-vue-next';
import { adminApi } from '../../services/api';
import { useAdminAuth } from '../../composables/useAdminAuth';

const stats = ref(null);

const cards = ref([]);
const { user } = useAdminAuth();
const userName = user.value?.username || 'there';

onMounted(async () => {
  const res = await adminApi.dashboard();
  stats.value = res.data;
  cards.value = [
    { label: 'Total Products', value: stats.value.totalProducts, icon: Package, color: 'text-brand-500', bar: 'bg-brand-500' },
    { label: 'Published Products', value: stats.value.publishedProducts, icon: Eye, color: 'text-emerald-500', bar: 'bg-emerald-500' },
    { label: 'Featured Products', value: stats.value.featuredProducts, icon: Star, color: 'text-amber-500', bar: 'bg-amber-500' },
    { label: 'Total Categories', value: stats.value.totalCategories, icon: FolderTree, color: 'text-sky-500', bar: 'bg-sky-500' },
    { label: 'Total Testimonials', value: stats.value.totalTestimonials, icon: CheckCircle2, color: 'text-violet-500', bar: 'bg-violet-500' },
    { label: 'Total Enquiries', value: stats.value.totalEnquiries, icon: Inbox, color: 'text-orange-500', bar: 'bg-orange-500' },
    { label: 'New Enquiries', value: stats.value.newEnquiries, icon: BarChart3, color: 'text-rose-500', bar: 'bg-rose-500' },
  ];
});
</script>
