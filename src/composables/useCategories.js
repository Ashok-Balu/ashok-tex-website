import { ref, watch, toValue } from 'vue';
import { api } from '../services/api';

const tree = ref([]);
const flat = ref([]);
let loadedTree = false;
let loadedFlat = false;

export function useCategoryTree() {
  if (!loadedTree) {
    loadedTree = true;
    api.categories.tree().then((res) => { tree.value = res.data; }).catch(() => {});
  }
  return { tree };
}

export function useCategoryFlat() {
  if (!loadedFlat) {
    loadedFlat = true;
    api.categories.flat().then((res) => { flat.value = res.data; }).catch(() => {});
  }
  return { flat };
}

export function useCategoryDetail(slugRef) {
  const category = ref(null);
  const loading = ref(true);
  const notFound = ref(false);

  async function fetchDetail() {
    const slug = toValue(slugRef);
    if (!slug) { notFound.value = true; loading.value = false; return; }
    loading.value = true;
    notFound.value = false;
    try {
      const res = await api.categories.bySlug(slug);
      category.value = res.data;
    } catch (e) {
      notFound.value = true;
      category.value = null;
    } finally {
      loading.value = false;
    }
  }

  watch(slugRef, fetchDetail, { immediate: true });
  return { category, loading, notFound };
}
