import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const studentProfilesEndpointPath = import.meta.env.VITE_STUDENT_PROFILES_ENDPOINT_PATH;
const studentGroupsEndpointPath = import.meta.env.VITE_STUDENT_GROUPS_ENDPOINT_PATH;
const usersEndpointPath = import.meta.env.VITE_USERS_ENDPOINT_PATH;
const testsEndpointPath = import.meta.env.VITE_VOCATIONAL_TESTS_ENDPOINT_PATH;
const resultsEndpointPath = import.meta.env.VITE_TEST_RESULTS_ENDPOINT_PATH;
const tasksEndpointPath = import.meta.env.VITE_TASKS_ENDPOINT_PATH;
const favoritesEndpointPath = import.meta.env.VITE_FAVORITES_ENDPOINT_PATH;
const careersEndpointPath = import.meta.env.VITE_CAREERS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for the Monitoring bounded context (psychologist side).
 * It reads the monitoring records and, as a read-only consumer, the data that other
 * contexts produce for each student (results, tasks, favorites).
 *
 * @class MonitoringApi
 * @extends BaseApi
 */
export class MonitoringApi extends BaseApi {
    #studentProfilesEndpoint;
    #studentGroupsEndpoint;
    #usersEndpoint;
    #testsEndpoint;
    #resultsEndpoint;
    #tasksEndpoint;
    #favoritesEndpoint;
    #careersEndpoint;

    constructor() {
        super();
        this.#studentProfilesEndpoint = new BaseEndpoint(this, studentProfilesEndpointPath);
        this.#studentGroupsEndpoint = new BaseEndpoint(this, studentGroupsEndpointPath);
        this.#usersEndpoint = new BaseEndpoint(this, usersEndpointPath);
        this.#testsEndpoint = new BaseEndpoint(this, testsEndpointPath);
        this.#resultsEndpoint = new BaseEndpoint(this, resultsEndpointPath);
        this.#tasksEndpoint = new BaseEndpoint(this, tasksEndpointPath);
        this.#favoritesEndpoint = new BaseEndpoint(this, favoritesEndpointPath);
        this.#careersEndpoint = new BaseEndpoint(this, careersEndpointPath);
    }

    /** @param {string} psychologistId @returns {Promise<import('axios').AxiosResponse>} Monitoring records. */
    getStudentProfiles(psychologistId) {
        return this.#studentProfilesEndpoint.getAll({ psychologistId });
    }

    /** @param {string} id @param {Object} changes @returns {Promise<import('axios').AxiosResponse>} */
    patchStudentProfile(id, changes) {
        return this.#studentProfilesEndpoint.patch(id, changes);
    }

    /** @param {string} psychologistId @returns {Promise<import('axios').AxiosResponse>} */
    getStudentGroups(psychologistId) {
        return this.#studentGroupsEndpoint.getAll({ psychologistId });
    }

    /** @returns {Promise<import('axios').AxiosResponse>} Every student user. */
    getStudents() {
        return this.#usersEndpoint.getAll({ role: 'student' });
    }

    /** @returns {Promise<import('axios').AxiosResponse>} */
    getTests() {
        return this.#testsEndpoint.getAll({ _sort: 'order', _order: 'asc' });
    }

    /** @returns {Promise<import('axios').AxiosResponse>} */
    getResults() {
        return this.#resultsEndpoint.getAll();
    }

    /** @returns {Promise<import('axios').AxiosResponse>} */
    getTasks() {
        return this.#tasksEndpoint.getAll();
    }

    /** @returns {Promise<import('axios').AxiosResponse>} */
    getFavorites() {
        return this.#favoritesEndpoint.getAll();
    }

    /** @returns {Promise<import('axios').AxiosResponse>} */
    getCareers() {
        return this.#careersEndpoint.getAll();
    }
}
