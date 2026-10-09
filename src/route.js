import { createRouter, createWebHistory } from 'vue-router';
import i18n from './i18n.js';

import { iamRoutes, psychologistIamRoutes } from './iam/presentation/iam-routes.js';
import { studentAssessmentRoutes } from './assessments/presentation/assessments-routes.js';
import { studentCareerExplorationRoutes } from './carrer-exploration/presentation/carrer-exploration-routes.js';
import { counselingRoutes, studentCounselingRoutes } from './counseling/presentation/counseling-routes.js';
import { studentCommunityRoutes } from './community/presentation/community-routes.js';
import { studentTasksRoutes } from './tasks/presentation/tasks-routes.js';
import { authenticationGuard } from './iam/infrastructure/authentication.guard.js';

const StudentLayout = () => import('./shared/presentation/components/student-layout.vue');
const StudentDashboard = () => import('./shared/presentation/views/student-dashboard.vue');
const About = () => import('./shared/presentation/views/about.vue');
const PageNotFound = () => import('./shared/presentation/views/page-not-found.vue');

const routes = [
    ...iamRoutes,

    // ----- Student area (sidebar layout of the mockups) -----
    {
        path: '/student',
        component: StudentLayout,
        meta: { requiresAuth: true, role: 'student' },
        children: [
            { path: '', redirect: { name: 'student-home' } },
            { path: 'home', name: 'student-home', component: StudentDashboard, meta: { title: 'nav.home' } },
            ...studentAssessmentRoutes,
            ...studentCareerExplorationRoutes,
            ...studentTasksRoutes,
            ...studentCounselingRoutes,
            ...studentCommunityRoutes
        ]
    },

    // ----- Psychologist area -----
    ...psychologistIamRoutes,
    ...counselingRoutes,

    { path: '/about', name: 'about', component: About, meta: { title: 'nav.about' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFound, meta: { title: 'notFound.title' } }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior: () => ({ top: 0 })
});

router.beforeEach(authenticationGuard);

router.afterEach(to => {
    const titleKey = to.meta?.title;
    document.title = titleKey ? `NextPath | ${i18n.global.t(titleKey)}` : 'NextPath';
});

export default router;
