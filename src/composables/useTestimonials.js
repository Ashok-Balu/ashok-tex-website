import { ref } from 'vue';
import { api } from '../services/api';

const testimonials = ref([]);
let loaded = false;

export function useTestimonials() {
  if (!loaded) {
    loaded = true;
    api.testimonials.list().then((res) => { testimonials.value = res.data; }).catch(() => {});
  }
  return { testimonials };
}
