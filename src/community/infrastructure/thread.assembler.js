import { Thread } from '../domain/model/thread.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';

/**
 * Maps thread resources into domain entities.
 *
 * @class ThreadAssembler
 */
export class ThreadAssembler {
    /** @param {Object} resource @returns {Thread} */
    static toEntityFromResource(resource) {
        return new Thread({ ...resource, id: String(resource.id), communityId: String(resource.communityId) });
    }

    /** @param {import('axios').AxiosResponse} response @returns {Thread[]} */
    static toEntitiesFromResponse(response) {
        return extractResources(response, 'threads').map(resource => this.toEntityFromResource(resource));
    }
}