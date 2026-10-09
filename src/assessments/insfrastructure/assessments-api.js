import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const testsEndpointPath = import.meta.env.VITE_VOCATIONAL_TESTS_ENDPOINT_PATH;
const questionsEndpointPath = import.meta.env.VITE_TEST_QUESTIONS_ENDPOINT_PATH;
const resultsEndpointPath = import.meta.env.VITE_TEST_RESULTS_ENDPOINT_PATH;
const careersEndpointPath = import.meta.env.VITE_CAREERS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for the Assessments bounded context.
 *
 * @class AssessmentsApi
 * @extends BaseApi
 */
export class AssessmentsApi extends BaseApi {
    #testsEndpoint;
    #questionsEndpoint;
    #resultsEndpoint;
    #careersEndpoint;

    constructor() {
        super();
        this.#testsEndpoint = new BaseEndpoint(this, testsEndpointPath);
        this.#questionsEndpoint = new BaseEndpoint(this, questionsEndpointPath);
        this.#resultsEndpoint = new BaseEndpoint(this, resultsEndpointPath);
        this.#careersEndpoint = new BaseEndpoint(this, careersEndpointPath);
    }

    /** @returns {Promise<import('axios').AxiosResponse>} All vocational tests ordered. */
    getTests() {
        return this.#testsEndpoint.getAll({ _sort: 'order', _order: 'asc' });
    }

    /** @param {string} id @returns {Promise<import('axios').AxiosResponse>} */
    getTestById(id) {
        return this.#testsEndpoint.getById(id);
    }

    /** @param {string} testId @returns {Promise<import('axios').AxiosResponse>} Questions of a test. */
    getQuestionsByTestId(testId) {
        return this.#questionsEndpoint.getAll({ testId, _sort: 'order', _order: 'asc' });
    }

    /** @param {string} studentId @returns {Promise<import('axios').AxiosResponse>} Results of a student. */
    getResultsByStudentId(studentId) {
        return this.#resultsEndpoint.getAll({ studentId });
    }

    /** @param {string} id @returns {Promise<import('axios').AxiosResponse>} */
    getResultById(id) {
        return this.#resultsEndpoint.getById(id);
    }

    /** @param {Object} resource @returns {Promise<import('axios').AxiosResponse>} */
    createResult(resource) {
        return this.#resultsEndpoint.create(resource);
    }

    /** @param {Object} resource @returns {Promise<import('axios').AxiosResponse>} */
    updateResult(resource) {
        return this.#resultsEndpoint.update(resource.id, resource);
    }

    /**
     * Career profiles used to compute compatibility (read-only view of the careers resource).
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getCareerProfiles() {
        return this.#careersEndpoint.getAll();
    }
}
