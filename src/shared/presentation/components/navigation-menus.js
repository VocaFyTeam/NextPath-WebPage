/**
 * Side-menu definitions for each role (same order and icons as the mock-ups).
 * `section` must match the `meta.section` of the routes so the active item is highlighted.
 */

/** Student menu (mock-ups 2 - 11). */
export const studentMenu = [
    { section: 'home', to: { name: 'student-home' }, icon: 'pi pi-home', label: 'nav.home' },
    { section: 'favorites', to: { name: 'favorite-careers' }, icon: 'pi pi-heart', label: 'nav.favorites' },
    { section: 'tests', to: { name: 'vocational-test-list' }, icon: 'pi pi-search', label: 'nav.tests' },
    { section: 'careers', to: { name: 'career-list' }, icon: 'pi pi-book', label: 'nav.careers' },
    { section: 'tasks', to: { name: 'task-board' }, icon: 'pi pi-id-card', label: 'nav.tasks' },
    { section: 'sessions', to: { name: 'student-sessions' }, icon: 'pi pi-user-plus', label: 'nav.sessions' },
    { section: 'messages', to: { name: 'student-messages' }, icon: 'pi pi-comment', label: 'nav.messages' },
    { section: 'community', to: { name: 'community-forum' }, icon: 'pi pi-users', label: 'nav.community' }
];

/** Psychologist menu (mock-ups 12 - 17). */
export const psychologistMenu = [
    { section: 'home', to: { name: 'psychologist-home' }, icon: 'pi pi-home', label: 'nav.home' },
    { section: 'students', to: { name: 'student-monitoring' }, icon: 'pi pi-search', label: 'nav.studentResults' },
    { section: 'reports', to: { name: 'group-report' }, icon: 'pi pi-id-card', label: 'nav.reports' },
    { section: 'sessions', to: { name: 'counseling-sessions' }, icon: 'pi pi-user-plus', label: 'nav.sessions' },
    { section: 'resources', to: { name: 'resource-library' }, icon: 'pi pi-book', label: 'nav.resources' },
    { section: 'messages', to: { name: 'psychologist-messages' }, icon: 'pi pi-comment', label: 'nav.messages' }
];
