import { TestResult } from '../domain/model/test-result.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';

/**
 * Maps test result resources into domain entities and back.
 *
 * @class TestResultAssembler
 */
export class TestResultAssembler {
    /** @param {Object} resource @returns {TestResult} */
    static toEntityFromResource(resource) {
        return new TestResult({ ...resource, id: String(resource.id), testId: String(resource.testId) });
    }

    /** @param {import('axios').AxiosResponse} response @returns {TestResult[]} */
    static toEntitiesFromResponse(response) {
        return extractResources(response, 'test-results').map(resource => this.toEntityFromResource(resource));
    }

    /**
     * @param {TestResult} entity - Domain entity.
     * @returns {Object} Resource ready to be persisted.
     */
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
