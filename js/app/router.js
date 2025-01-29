import { login } from './pages/login.js';

export const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: '/', name: 'Sign in', component: login },
        { path: '/campaigns', name: 'Campaigns', component: campaigns },
        { path: '/campaign/:id', name: 'Campaign', component: campaign },
        { path: '/users', name: 'Users', component: users },
        { path: '/user/:id', name: 'User', component: user },
        { path: '/ads', name: 'Ads', component: ads },
        { path: '/statistics', name: 'Statistics', component: statistics },
        { path: '/payments', name: 'Payments', component: payments },
        { path: '/sites', name: 'Sites', component: sites }, 
    ]
});
