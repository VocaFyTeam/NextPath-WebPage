import { createApp } from 'vue';

import App from './App.vue';
import router from './route.js';
import pinia from './pinia.js';
import i18n from './i18n.js';

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import MultiSelect from 'primevue/multiselect';
import ProgressBar from 'primevue/progressbar';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import NextPathPreset from './shared/presentation/theme/nextpath-preset.js';

import 'primeicons/primeicons.css';
import './style.css';

createApp(App)
    .use(pinia)
    .use(i18n)
    .use(PrimeVue, { theme: { preset: NextPathPreset, options: { darkModeSelector: false } }, ripple: true, license: import.meta.env.VITE_PRIME_UI_LICENSE_KEY })
    .use(ToastService)
    .component('pv-button', Button)
    .component('pv-checkbox', Checkbox)
    .component('pv-dialog', Dialog)
    .component('pv-input-text', InputText)
    .component('pv-multi-select', MultiSelect)
    .component('pv-password', Password)
    .component('pv-progress-bar', ProgressBar)
    .component('pv-select', Select)
    .component('pv-textarea', Textarea)
    .component('pv-toast', Toast)
    .directive('tooltip', Tooltip)
    .use(router)
    .mount('#app');
