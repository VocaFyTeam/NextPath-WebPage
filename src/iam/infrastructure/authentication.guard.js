import { useIamStore } from '../application/iam.store.js';

const guestOnlyRoutes = ['welcome', 'login', 'register'];

/**
 * Navigation guard that protects private routes and sends each role to its own area.
 *
 * - Routes with `meta.requiresAuth` need a signed-in user.
 * - Routes with `meta.role` are only available for that role.
 * - Signed-in users are redirected away from welcome / login / register.
 *
 * @param {import('vue-router').RouteLocationNormalized} to - Target route.
 * @returns {Object|boolean} `true` to continue or a redirect location.
 */
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
