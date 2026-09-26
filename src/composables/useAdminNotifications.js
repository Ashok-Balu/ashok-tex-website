import { ref } from 'vue';

const notifications = ref([]);
let nextId = 1;
const timers = new Map();

export function useAdminNotifications() {
  function notify(message, type = 'success', duration = 4200) {
    const id = nextId++;
    notifications.value.push({ id, message, type, duration });
    if (notifications.value.length > 4) dismiss(notifications.value[0].id);
    timers.set(id, window.setTimeout(() => dismiss(id), duration));
  }

  function dismiss(id) {
    window.clearTimeout(timers.get(id));
    timers.delete(id);
    notifications.value = notifications.value.filter((item) => item.id !== id);
  }

  return { notifications, notify, dismiss };
}