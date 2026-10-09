
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { TasksApi } from '../infrastructure/tasks-api.js';
import { StudentTaskAssembler } from '../infrastructure/student-task.assembler.js';

const tasksApi = new TasksApi();

export const useTasksStore = defineStore('tasks', () => {
    const tasks = ref([]);
    const tasksLoaded = ref(false);
    const errors = ref([]);

    const pendingTasks = computed(() => tasks.value.filter(task => !task.isCompleted));
    const completedTasks = computed(() => tasks.value.filter(task => task.isCompleted));

    async function fetchTasks(studentId) {
        try {
            const response = await tasksApi.getTasksByStudentId(studentId);
            tasks.value = StudentTaskAssembler.toEntitiesFromResponse(response);
            tasksLoaded.value = true;
        } catch (error) {
            errors.value.push(error);
        }
    }

    async function toggleTask(taskId) {
        const task = tasks.value.find(t => t.id === taskId);
        if (!task) return;
        const status = task.toggledStatus;
        try {
            await tasksApi.patchTask(taskId, { status });
            task.status = status;
        } catch (error) {
            errors.value.push(error);
        }
    }

    return { tasks, tasksLoaded, errors, pendingTasks, completedTasks, fetchTasks, toggleTask };
});

export default useTasksStore;
