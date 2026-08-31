import { ref } from 'vue';
import { api } from '../services/api';

const company = ref(null);
let loaded = false;

async function loadCompany() {
  try {
    const res = await api.settings.company();
    company.value = res.data || null;
    return company.value;
  } catch (error) {
    company.value = null;
    return null;
  }
}

export function useCompany() {
  if (!loaded) {
    loaded = true;
    loadCompany();
  }

  return {
    company,
    refreshCompany: loadCompany,
    setCompany: (value) => {
      company.value = value || null;
    },
  };
}
