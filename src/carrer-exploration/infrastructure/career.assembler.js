import { Career } from '../domain/model/career.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';

export class CareerAssembler {
    /** @param {Object} resource @returns {Career} */
    static toEntityFromResource(resource) {
        return new Career({ ...resource, id: String(resource.id) });
    }

    /** @param {import('axios').AxiosResponse} response @returns {Career[]} */
    static toEntitiesFromResponse(response) {
        return extractResources(response, 'careers').map(resource => this.toEntityFromResource(resource));
    }
}
