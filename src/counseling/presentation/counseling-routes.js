const SessionsList = () => import('./views/sessions-list.vue');
const StudentSessions = () => import('./views/student-sessions.vue');
const Messages = () => import('./views/messages.vue');
const PsychologistMessages = () => import('./views/psychologist-messages.vue');

export const psychologistCounselingRoutes = [
    { path: 'sessions', name: 'counseling-sessions', component: SessionsList, meta: { title: 'nav.sessions', section: 'sessions' } },
    { path: 'messages', name: 'psychologist-messages', component: PsychologistMessages, meta: { title: 'nav.messages', section: 'messages' } }
];

export const studentCounselingRoutes = [
    { path: 'sessions', name: 'student-sessions', component: StudentSessions, meta: { title: 'nav.sessions', section: 'sessions' } },
    { path: 'messages', name: 'student-messages', component: Messages, meta: { title: 'nav.messages', section: 'messages' } }
];
