import { createApp } from 'vue';
import App from './App.vue';
import { createWebHistory, createRouter } from "vue-router";
import Loading from 'vue3-loading-screen';
import axios from 'axios';
import VueAxios from 'vue-axios'
import { BootstrapVue3 } from 'bootstrap-vue-3';
// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

import LoginPage from '@/components/LoginPage';
import HomePage from '@/components/HomePage';
import SignUpPage from '@/components/SignUpPage';
import AddRecordPage from '@/components/AddRecordPage';
import EditRecordPage from '@/components/EditRecordPage';
import NotFoundPage from '@/components/NotFoundPage';

const routes = [
    { path: '/login', name: 'Login', component: LoginPage },
    { path: '/signup', name: 'Sign Up', component: SignUpPage },
    { path: '/', name: 'Home', component: HomePage },
    { path: '/add_record', name: 'Add Record', component: AddRecordPage },
    { path: '/edit_record/:id', name: 'Edit Record', component: EditRecordPage },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage },
    // { path: '/map_view', name: 'Map View', component: MapView },
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHistory(),
    routes, // short for `routes: routes`
});

const app = createApp(App);
app.use(BootstrapVue3);
app.use(router);
app.use(Loading, {
    icon_color: "#C44228",
    icon: 'fas fa-spinner',
    size: 5,  
    bg: '#A971601D',
});
app.use(VueAxios, axios);

app.mount('#app');
