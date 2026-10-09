import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const tasksEndpointPath = import.meta.env.VITE_TASKS_ENDPOINT_PATH;

export class TasksApi extends BaseApi {
    #tasksEndpoint;

    constructor() {
        super();
        this.#tasksEndpoint = new BaseEndpoint(this, tasksEndpointPath);
    }

    getTasksByStudentId(studentId) {
        return this.#tasksEndpoint.getAll({ studentId, _sort: 'order', _order: 'asc' });
    }

    patchTask(id, changes) {
        return this.#tasksEndpoint.patch(id, changes);
    }
}
