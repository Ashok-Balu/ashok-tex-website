import { ref } from 'vue';
import { api } from '../services/api';

const sections = ref([]);
let loaded = false;

export function useHomepageSections() {
  if (!loaded) {
    loaded = true;
    api.settings.homepageSections().then((res) => { sections.value = res.data; }).catch(() => {});
  }
  return { sections };
}

export function getSection(sections, key) {
  return sections.find((s) => s.section_key === key) || null;
}
