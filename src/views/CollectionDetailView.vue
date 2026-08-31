<template>
  <div class="pt-20 pb-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="py-5">
        <Breadcrumb :items="breadcrumbItems" />
      </div>

      <div v-if="loading" class="text-center py-24 text-ink-400">Loading collection&hellip;</div>

      <div v-else-if="currentCollection" class="space-y-12">

        <!-- Hero Banner -->
        <div class="relative bg-ink-950 text-white rounded-3xl overflow-hidden shadow-float min-h-72">
          <img :src="currentCollection.image" :alt="currentCollection.name" class="absolute inset-0 w-full h-full object-cover opacity-25" />
          <div class="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-transparent"></div>
          <div class="relative z-10 p-8 sm:p-12 max-w-2xl">
            <p
              class="text-xs font-semibold uppercase tracking-widest mb-3"
              :style="{ color: currentCollection.accentColor || '#f59e0b' }"
            >
              Ashok Tex · Karur Mill
            </p>
            <h1 class="font-display text-4xl sm:text-5xl font-bold text-white mb-4">{{ currentCollection.name }}</h1>
            <p class="text-white/70 text-base leading-relaxed mb-8">{{ currentCollection.description }}</p>
            <div class="flex flex-wrap gap-3">
              <router-link :to="`/request-quote?category=${encodeURIComponent(currentCollection.name)}`" class="px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white font-semibold rounded-xl transition-all text-sm shadow-lg">
                Request {{ currentCollection.name }} Quote
              </router-link>
              <a :href="`https://wa.me/917904154775?text=${encodeURIComponent('Hello Ashok Tex, I am interested in your ' + currentCollection.name + '.')}`" target="_blank" rel="noopener" class="px-6 py-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 font-semibold rounded-xl border border-green-500/30 transition-all text-sm flex items-center gap-2">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <!-- Subcategories -->
        <div v-if="currentCollection.children && currentCollection.children.length" class="flex flex-wrap gap-3">
          <router-link
            v-for="child in currentCollection.children" :key="child.id"
            :to="`/collections/${child.slug}`"
            class="px-4 py-2 bg-surface-50 hover:bg-surface-100 border border-surface-200 rounded-xl text-sm font-medium text-ink-700 transition-colors"
          >{{ child.name }} ({{ child.productCount }})</router-link>
        </div>

        <!-- Products Header -->
        <div class="flex items-center justify-between border-b border-surface-200 pb-5">
          <h2 class="font-display text-2xl font-bold text-ink-900">Available {{ currentCollection.name }} <span class="text-ink-400 font-normal text-xl">({{ pagination.total }})</span></h2>
          <router-link to="/products" class="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1.5">All Products →</router-link>
        </div>

        <div v-if="collectionProducts.length > 0">
          <ProductGrid :products="collectionProducts" />
        </div>
        <EmptyState v-else title="No Products Available" message="No items are currently listed in this category." action-text="View All Products" @action="$router.push('/products')" />
      </div>

      <div v-else class="text-center py-24">
        <h2 class="font-display text-3xl font-bold text-ink-900 mb-5">Collection Not Found</h2>
        <router-link to="/collections" class="btn-primary">Return to Collections</router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCategoryDetail } from '../composables/useCategories';
import { useProductList } from '../composables/useProducts';
import Breadcrumb from '../components/Breadcrumb.vue';
import ProductGrid from '../components/ProductGrid.vue';
import EmptyState from '../components/EmptyState.vue';

const route = useRoute();
const props = defineProps({ category: { type: String, default: '' } });

const categorySlug = computed(() => props.category || route.params.category || route.path.split('/collections/')[1]);
const { category: currentCollection, loading } = useCategoryDetail(categorySlug);

const { products: collectionProducts, pagination } = useProductList(computed(() => ({ category: categorySlug.value, limit: 100 })));

const breadcrumbItems = computed(() => {
  const ancestry = currentCollection.value?.breadcrumb || [];
  const items = [{ name: 'Collections', path: '/collections' }];
  ancestry.forEach((c, idx) => {
    items.push({ name: c.name, path: idx < ancestry.length - 1 ? `/collections/${c.slug}` : undefined });
  });
  if (!ancestry.length) items.push({ name: 'Collection' });
  return items;
});
</script>

