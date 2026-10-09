const ResourceLibrary = () => import('./views/resource-library.vue');

export const psychologistResourcesRoutes = [
    { path: 'resources', name: 'resource-library', component: ResourceLibrary, meta: { title: 'nav.resources', section: 'resources' } }
];
