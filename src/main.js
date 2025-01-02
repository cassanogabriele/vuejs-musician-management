import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

library.add(faEdit, faTrash, faPlus);

const app = createApp(App)

// Enregistrer le composant Font Awesome
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router)

app.mount('#app')
