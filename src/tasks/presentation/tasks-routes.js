const TaskBoard = () => import('./views/task-board.vue');

/** Student routes of the Tasks bounded context (children of /student). */
export const studentTasksRoutes = [
    { path: 'tasks', name: 'task-board', component: TaskBoard, meta: { title: 'nav.tasks', section: 'tasks' } }
];