import { CounselingSession } from '../domain/model/counseling-session.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';

/**
 * Maps counseling session resources into domain entities and back.
 *
 * @class CounselingSessionAssembler
 */
export class CounselingSessionAssembler {
    /** @param {Object} resource @returns {CounselingSession} */
    static toEntityFromResource(resource) {
        return new CounselingSession({ ...resource, id: String(resource.id) });
    }

    /** @param {import('axios').AxiosResponse} response @returns {CounselingSession[]} */
    static toEntitiesFromResponse(response) {
        return extractResources(response, 'counseling-sessions').map(resource => this.toEntityFromResource(resource));
    }

    /** @param {CounselingSession} entity @returns {Object} */
    static toResourceFromEntity(entity) {
        const resource = { ...entity };
        if (!resource.id) delete resource.id;
        return resource;
    }
}
