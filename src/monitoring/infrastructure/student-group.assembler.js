import { StudentGroup } from '../domain/model/student-group.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';

/**
 * Maps student group resources into domain entities.
 *
 * @class StudentGroupAssembler
 */
export class StudentGroupAssembler {
    /** @param {Object} resource @returns {StudentGroup} */
    static toEntityFromResource(resource) {
        return new StudentGroup({ ...resource, id: String(resource.id) });
    }

    /** @param {import('axios').AxiosResponse} response @returns {StudentGroup[]} */
    static toEntitiesFromResponse(response) {
        return extractResources(response, 'student-groups').map(resource => this.toEntityFromResource(resource));
    }
}
