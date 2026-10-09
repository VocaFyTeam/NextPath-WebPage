import { extractResources } from '../../shared/infrastructure/base-assembler.js';
import {FavoriteCareer} from "../domain/model/favorite-career.entity.js";

export class FavoriteCareerAssembler {
    static toEntityFromResource(resource) {
        return new FavoriteCareer({ ...resource, id: String(resource.id), careerId: String(resource.careerId) });
    }

    static toEntitiesFromResponse(response) {
        return extractResources(response, 'favorites').map(resource => this.toEntityFromResource(resource));
    }

    static toResourceFromEntity(entity) {
        return { studentId: entity.studentId, careerId: entity.careerId };
    }
}
