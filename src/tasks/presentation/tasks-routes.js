const TaskBoard = () => import('./views/task-board.vue');

export const studentTasksRoutes = [
    { path: 'tasks', name: 'task-board', component: TaskBoard, meta: { title: 'nav.tasks', section: 'tasks' } }
];
