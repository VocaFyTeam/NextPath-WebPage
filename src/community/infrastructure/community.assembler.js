import { Community } from '../domain/model/community.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';

/**
 * Maps community resources into domain entities.
 *
 * @class CommunityAssembler
 */
export class CommunityAssembler {
    /** @param {Object} resource @returns {Community} */
    static toEntityFromResource(resource) {
        return new Community({ ...resource, id: String(resource.id) });
    }

    /** @param {import('axios').AxiosResponse} response @returns {Community[]} */
    static toEntitiesFromResponse(response) {
        return extractResources(response, 'communities').map(resource => this.toEntityFromResource(resource));
    }
}