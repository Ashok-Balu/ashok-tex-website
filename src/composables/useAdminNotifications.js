import { ref } from 'vue';

const notifications = ref([]);
let nextId = 1;

export function useAdminNotifications() {
  function notify(message, type = 'success', duration = 4200) {
    const id = nextId++;
    notifications.value.push({ id, message, type });
    window.setTimeout(() => dismiss(id), duration);
  }

  function dismiss(id) {
    notifications.value = notifications.value.filter((item) => item.id !== id);
  }

  return { notifications, notify, dismiss };
}