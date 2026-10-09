import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const tasksEndpointPath = import.meta.env.VITE_TASKS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for the Tasks bounded context.
 *
 * @class TasksApi
 * @extends BaseApi
 */
export class TasksApi extends BaseApi {
    #tasksEndpoint;

    constructor() {
        super();
        this.#tasksEndpoint = new BaseEndpoint(this, tasksEndpointPath);
    }

    /** @param {string} studentId @returns {Promise<import('axios').AxiosResponse>} */
    getTasksByStudentId(studentId) {
        return this.#tasksEndpoint.getAll({ studentId, _sort: 'order', _order: 'asc' });
    }

    /** @param {string} id @param {Object} changes @returns {Promise<import('axios').AxiosResponse>} */
    patchTask(id, changes) {
        return this.#tasksEndpoint.patch(id, changes);
    }
}