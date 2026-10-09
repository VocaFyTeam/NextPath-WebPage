import { useIamStore } from '../application/iam.store.js';

const guestOnlyRoutes = ['welcome', 'login', 'register'];

export const authenticationGuard = (to) => {
    const store = useIamStore();

    if (store.isSignedIn && guestOnlyRoutes.includes(to.name)) {
        return store.homeRoute;
    }

    const requiresAuth = to.matched.some(record => record.meta?.requiresAuth);
    if (requiresAuth && !store.isSignedIn) {
        return { name: 'login', query: { redirect: to.fullPath } };
    }

    const requiredRole = to.matched.map(record => record.meta?.role).find(Boolean);
    if (requiredRole && store.currentUser?.role !== requiredRole) {
        return store.homeRoute;
    }

    return true;
};
