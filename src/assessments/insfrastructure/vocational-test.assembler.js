import { VocationalTest } from '../domain/model/vocational-test.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';

/**
 * Maps vocational test resources into domain entities.
 *
 * @class VocationalTestAssembler
 */
export class VocationalTestAssembler {
    /** @param {Object} resource @returns {VocationalTest} */
    static toEntityFromResource(resource) {
        return new VocationalTest({ ...resource, id: String(resource.id) });
    }

    /** @param {import('axios').AxiosResponse} response @returns {VocationalTest[]} */
    static toEntitiesFromResponse(response) {
        return extractResources(response, 'vocational-tests').map(resource => this.toEntityFromResource(resource));
    }
}
