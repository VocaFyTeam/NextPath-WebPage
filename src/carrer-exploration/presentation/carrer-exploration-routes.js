const CareerList = () => import('./views/career-list.vue');
const CareerDetail = () => import('./views/career-detail.vue');
const CareerProjection = () => import('../../../../../Aplicaciones Web/nextpath/src/carrer-exploration/presentation/views/career-projection.vue');
const CareerComparison = () => import('./views/career-comparison.vue');
const FavoriteCareers = () => import('./views/favorite-careers.vue');

export const studentCareerExplorationRoutes = [
    { path: 'favorites', name: 'favorite-careers', component: FavoriteCareers, meta: { title: 'nav.favorites', section: 'favorites' } },
    { path: 'careers', name: 'career-list', component: CareerList, meta: { title: 'nav.careers', section: 'careers' } },
    { path: 'careers/compare', name: 'career-comparison', component: CareerComparison, meta: { title: 'comparison.title', section: 'careers' } },
    { path: 'careers/:id', name: 'career-detail', component: CareerDetail, meta: { title: 'nav.careers', section: 'careers' } },
    { path: 'careers/:id/projection', name: 'career-projection', component: CareerProjection, meta: { title: 'projection.pageTitle', section: 'careers' } }
];
