import { TestQuestion } from '../domain/model/test-question.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js'

export class TestQuestionAssembler {
    static toEntityFromResource(resource) {
        return new TestQuestion({ ...resource, id: String(resource.id), testId: String(resource.testId) });
    }

    static toEntitiesFromResponse(response) {
        return extractResources(response, 'test-questions').map(resource => this.toEntityFromResource(resource));
    }
}
