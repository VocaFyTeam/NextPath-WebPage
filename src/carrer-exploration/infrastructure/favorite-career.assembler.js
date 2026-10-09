import { extractResources } from '../../shared/infrastructure/base-assembler.js';
import {FavoriteCareer} from "../domain/model/favorite-career.entity.js";

export class FavoriteCareerAssembler {
    /** @param {Object} resource @returns {FavoriteCareer} */
    static toEntityFromResource(resource) {
        return new FavoriteCareer({ ...resource, id: String(resource.id), careerId: String(resource.careerId) });
    }

    /** @param {import('axios').AxiosResponse} response @returns {FavoriteCareer[]} */
    static toEntitiesFromResponse(response) {
        return extractResources(response, 'favorites').map(resource => this.toEntityFromResource(resource));
    }

    /** @param {FavoriteCareer} entity @returns {Object} */
    static toResourceFromEntity(entity) {
        return { studentId: entity.studentId, careerId: entity.careerId };
    }
}
