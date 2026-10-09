const PsychologistDashboard = () => import('./views/psychologist-dashboard.vue');
const StudentMonitoring = () => import('./views/student-monitoring.vue');
const GroupReport = () => import('./views/group-report.vue');

/** Psychologist routes of the Monitoring bounded context (children of /psychologist). */
export const psychologistMonitoringRoutes = [
    { path: 'home', name: 'psychologist-home', component: PsychologistDashboard, meta: { title: 'nav.home', section: 'home' } },
    { path: 'students', name: 'student-monitoring', component: StudentMonitoring, meta: { title: 'nav.studentResults', section: 'students' } },
    { path: 'reports', name: 'group-report', component: GroupReport, meta: { title: 'nav.reports', section: 'reports' } }
];
