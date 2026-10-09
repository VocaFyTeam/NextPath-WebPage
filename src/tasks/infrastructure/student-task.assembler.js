import { StudentTask } from '../domain/model/student-task.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';

/**
 * Maps task resources into domain entities.
 *
 * @class StudentTaskAssembler
 */
export class StudentTaskAssembler {
    /** @param {Object} resource @returns {StudentTask} */
    static toEntityFromResource(resource) {
        return new StudentTask({ ...resource, id: String(resource.id) });
    }

    /** @param {import('axios').AxiosResponse} response @returns {StudentTask[]} */
    static toEntitiesFromResponse(response) {
        return extractResources(response, 'tasks').map(resource => this.toEntityFromResource(resource));
    }
}