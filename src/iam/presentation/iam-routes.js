const Welcome = () => import('./views/welcome.vue');
const Login = () => import('./views/login.vue');
const Register = () => import('./views/register.vue');
const Dashboard = () => import('./views/dashboard.vue');

export const iamRoutes = [
    { path: '/', name: 'welcome', component: Welcome, meta: { title: 'auth.welcomeTitle' } },
    { path: '/login', name: 'login', component: Login, meta: { title: 'auth.signInTitle' } },
    { path: '/register', name: 'register', component: Register, meta: { title: 'auth.signUpTitle' } }
];

export const psychologistIamRoutes = [
    { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true, role: 'psychologist' } }
];
