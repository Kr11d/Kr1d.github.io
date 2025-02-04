import { login } from './pages/login.js';
import { campaings } from './pages/campaings.js';

export const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: '/', name: 'Sign in', component: login },
        { path: '/campaings', name: 'Campaings', component: campaings },
    ]
});
