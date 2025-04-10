import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEdit, faTrash, faPlus, faHeart } from '@fortawesome/free-solid-svg-icons';

// AJOUTE faHeart ICI !
library.add(faEdit, faTrash, faPlus, faHeart);

const app = createApp(App);

// Enregistrer le composant Font Awesome
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router);

app.mount('#app');
