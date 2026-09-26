import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createVuetify } from 'vuetify';
import { VForm } from 'vuetify/components';
import './style.css';

const vuetify = createVuetify({
  components: { VForm },
  theme: {
    defaultTheme: 'light',
  },
});

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount('#app');