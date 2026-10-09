const CommunityForum = () => import('./views/community-forum.vue');

export const studentCommunityRoutes = [
    { path: 'community', name: 'community-forum', component: CommunityForum, meta: { title: 'nav.community', section: 'community' } }
];