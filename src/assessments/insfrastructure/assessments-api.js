import { BaseApi } from '../../shared/infrastructure/base-api.js'
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js'

const testsEndpointPath = import.meta.env.VITE_VOCATIONAL_TESTS_ENDPOINT_PATH;
const questionsEndpointPath = import.meta.env.VITE_TEST_QUESTIONS_ENDPOINT_PATH;
const resultsEndpointPath = import.meta.env.VITE_TEST_RESULTS_ENDPOINT_PATH;
const careersEndpointPath = import.meta.env.VITE_CAREERS_ENDPOINT_PATH;

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

    getTests() {
        return this.#testsEndpoint.getAll({ _sort: 'order', _order: 'asc' });
    }

    getTestById(id) {
        return this.#testsEndpoint.getById(id);
    }

    getQuestionsByTestId(testId) {
        return this.#questionsEndpoint.getAll({ testId, _sort: 'order', _order: 'asc' });
    }

    getResultsByStudentId(studentId) {
        return this.#resultsEndpoint.getAll({ studentId });
    }

    getResultById(id) {
        return this.#resultsEndpoint.getById(id);
    }

    createResult(resource) {
        return this.#resultsEndpoint.create(resource);
    }

    updateResult(resource) {
        return this.#resultsEndpoint.update(resource.id, resource);
    }


    getCareerProfiles() {
        return this.#careersEndpoint.getAll();
    }
}
