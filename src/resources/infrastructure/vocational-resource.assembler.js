import { VocationalResource } from '../domain/model/vocational-resource.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';

/**
 * Maps resource payloads into domain entities.
 *
 * @class VocationalResourceAssembler
 */
export class VocationalResourceAssembler {
    /** @param {Object} resource @returns {VocationalResource} */
    static toEntityFromResource(resource) {
        return new VocationalResource({ ...resource, id: String(resource.id) });
    }

    /** @param {import('axios').AxiosResponse} response @returns {VocationalResource[]} */
    static toEntitiesFromResponse(response) {
        return extractResources(response, 'resources').map(resource => this.toEntityFromResource(resource));
    }
}
