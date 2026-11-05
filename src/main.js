import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './style.css';

const app = createApp(App);
let adminUiPromise;

router.beforeEach(async (to) => {
  if (to.meta?.isAdmin && !adminUiPromise) {
    adminUiPromise = import('./admin/vuetify.js').then(({ default: vuetify }) => app.use(vuetify));
  }

  if (to.meta?.isAdmin) await adminUiPromise;
});

app.use(router);
app.mount('#app');