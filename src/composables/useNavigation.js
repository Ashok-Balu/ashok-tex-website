import { ref } from 'vue';
import { api } from '../services/api';

const items = ref([]);
let loaded = false;

export function useNavigation() {
  if (!loaded) {
    loaded = true;
    api.settings.navigation().then((res) => { items.value = res.data; }).catch(() => {});
  }
  return { items };
}
