import { TestQuestion } from '../domain/model/test-question.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';

/**
 * Maps test question resources into domain entities.
 *
 * @class TestQuestionAssembler
 */
export class TestQuestionAssembler {
    /** @param {Object} resource @returns {TestQuestion} */
    static toEntityFromResource(resource) {
        return new TestQuestion({ ...resource, id: String(resource.id), testId: String(resource.testId) });
    }

    /** @param {import('axios').AxiosResponse} response @returns {TestQuestion[]} */
    static toEntitiesFromResponse(response) {
        return extractResources(response, 'test-questions').map(resource => this.toEntityFromResource(resource));
    }
}
