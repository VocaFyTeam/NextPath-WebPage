const VocationalTestList = () => import('../../../../../Aplicaciones Web/nextpath/src/assessments/presentation/view/vocational-test-list.vue');
const VocationalTest = () => import('./view/vocational-test.vue');
const VocationalResults = () => import('./view/vocational-results.vue');

export const studentAssessmentRoutes = [
    { path: 'tests', name: 'vocational-test-list', component: VocationalTestList, meta: { title: 'nav.tests', section: 'tests' } },
    { path: 'tests/:testId', name: 'vocational-test', component: VocationalTest, meta: { title: 'nav.tests', section: 'tests' } },
    { path: 'tests/results/:resultId', name: 'vocational-results', component: VocationalResults, meta: { title: 'results.pageTitle', section: 'tests' } }
];
