const SessionsList = () => import('./views/sessions-list.vue');
const StudentSessions = () => import('./views/student-sessions.vue');
const Messages = () => import('./views/messages.vue');

export const counselingRoutes = [
    {
        path: '/counseling',
        name: 'counseling-sessions',
        component: SessionsList,
        meta: { requiresAuth: true, role: 'psychologist' }
    }
];

export const studentCounselingRoutes = [
    { path: 'sessions', name: 'student-sessions', component: StudentSessions, meta: { title: 'nav.sessions', section: 'sessions' } },
    { path: 'messages', name: 'student-messages', component: Messages, meta: { title: 'nav.messages', section: 'messages' } }
];
