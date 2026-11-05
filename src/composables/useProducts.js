import { ref, watch, toValue } from 'vue';
import { api } from '../services/api';

function normalizeProductImageList(images) {
  if (!Array.isArray(images)) return [];
  return images.map((image) => (typeof image === 'string' ? image : image?.url || image?.src || '')).filter(Boolean);
}

function normalizeProduct(product) {
  if (!product || typeof product !== 'object') return product;
  return { ...product, images: normalizeProductImageList(product.images) };
}

export function useProductList(paramsRef) {
  const products = ref([]);
  const pagination = ref({ total: 0, page: 1, limit: 24, totalPages: 1 });
  const loading = ref(true);
  const error = ref(null);
  let lastRequestKey = '';
  let requestSequence = 0;

  async function fetchList() {
    const params = toValue(paramsRef) ?? {};
    const requestKey = JSON.stringify(params);
    if (requestKey === lastRequestKey && products.value.length) return;
    lastRequestKey = requestKey;
    const currentRequest = ++requestSequence;

    loading.value = true;
    error.value = null;
    try {
      const res = await api.products.list(params);
      if (currentRequest !== requestSequence) return;
      products.value = Array.isArray(res.data) ? res.data.map(normalizeProduct) : [];
      pagination.value = res.pagination;
    } catch (e) {
      if (currentRequest !== requestSequence) return;
      error.value = e.message;
      products.value = [];
    } finally {
      if (currentRequest === requestSequence) loading.value = false;
    }
  }

  let debounceTimer;
  watch(() => JSON.stringify(toValue(paramsRef) ?? {}), () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchList, 180);
  }, { immediate: true });

  return { products, pagination, loading, error, refetch: fetchList };
}

export function useProductDetail(slugRef) {
  const product = ref(null);
  const loading = ref(true);
  const notFound = ref(false);

  async function fetchDetail() {
    const slug = toValue(slugRef);
    if (!slug) { notFound.value = true; loading.value = false; return; }
    loading.value = true;
    notFound.value = false;
    try {
      const res = await api.products.bySlug(slug);
      product.value = normalizeProduct(res.data);
    } catch (e) {
      notFound.value = true;
      product.value = null;
    } finally {
      loading.value = false;
    }
  }

  watch(slugRef, fetchDetail, { immediate: true });

  return { product, loading, notFound, refetch: fetchDetail };
}

export function useProductFilters(categoryRef) {
  const facets = ref({});
  async function fetchFacets() {
    try {
      const res = await api.products.filters(toValue(categoryRef));
      facets.value = res.data;
    } catch {
      facets.value = {};
    }
  }
  watch(categoryRef, fetchFacets, { immediate: true });
  return { facets, refetch: fetchFacets };
}

export function useFeaturedProducts() {
  const products = ref([]);
  const loading = ref(true);
  const limit = 100;
  const fetchAllProducts = async (params) => {
    const firstPage = await api.products.list({ ...params, page: 1, limit });
    const pageCount = Number(firstPage.pagination?.totalPages) || 1;
    const otherPages = await Promise.all(Array.from({ length: pageCount - 1 }, (_, index) =>
      api.products.list({ ...params, page: index + 2, limit }),
    ));
    return [firstPage, ...otherPages].flatMap((response) => Array.isArray(response.data) ? response.data : []);
  };

  fetchAllProducts({ featured: true, sort: 'featured' })
    .then(async (res) => {
      if (res.length) {
        products.value = res;
        return;
      }
      products.value = await fetchAllProducts({ sort: 'featured' });
    })
    .catch(() => { products.value = []; })
    .finally(() => { loading.value = false; });
  return { products, loading };
}
