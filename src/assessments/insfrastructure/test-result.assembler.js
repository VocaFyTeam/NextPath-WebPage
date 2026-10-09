import { TestResult } from '../domain/model/test-result.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';


export class TestResultAssembler {
    static toEntityFromResource(resource) {
        return new TestResult({ ...resource, id: String(resource.id), testId: String(resource.testId) });
    }

    static toEntitiesFromResponse(response) {
        return extractResources(response, 'test-results').map(resource => this.toEntityFromResource(resource));
    }

    static toResourceFromEntity(entity) {
        const resource = {
            studentId: entity.studentId,
            testId: entity.testId,
            date: entity.date,
            version: entity.version,
            status: entity.status,
            summary: entity.summary,
            scores: entity.profile.toJSON(),
            careerMatches: entity.careerMatches,
            answers: entity.answers
        };
        if (entity.id) resource.id = entity.id;
        return resource;
    }
}
