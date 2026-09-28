import { ref } from 'vue';

const confirmation = ref(null);
let resolveCurrent = null;

export function useAdminConfirm() {
  function confirmAction(message, { title = 'Confirm deletion', confirmText = 'Delete' } = {}) {
    if (resolveCurrent) resolveCurrent(false);
    confirmation.value = { message, title, confirmText };
    return new Promise((resolve) => {
      resolveCurrent = resolve;
    });
  }

  function resolveConfirmation(confirmed) {
    if (!resolveCurrent) return;
    const resolve = resolveCurrent;
    resolveCurrent = null;
    confirmation.value = null;
    resolve(confirmed);
  }

  return { confirmation, confirmAction, resolveConfirmation };
}