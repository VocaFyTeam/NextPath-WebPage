import { Community } from '../domain/model/community.entity.js';
import {extractResources} from "../../shared/infrastructure/base-assembler.js";

export class CommunityAssembler {
    static toEntityFromResource(resource) {
        return new Community({ ...resource, id: String(resource.id) });
    }

    static toEntitiesFromResponse(response) {
        return extractResources(response, 'communities').map(resource => this.toEntityFromResource(resource));
    }
}
