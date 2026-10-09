import { StudentTask } from '../domain/model/student-task.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';

export class StudentTaskAssembler {
    static toEntityFromResource(resource) {
        return new StudentTask({ ...resource, id: String(resource.id) });
    }

    static toEntitiesFromResponse(response) {
        return extractResources(response, 'tasks').map(resource => this.toEntityFromResource(resource));
    }
}
