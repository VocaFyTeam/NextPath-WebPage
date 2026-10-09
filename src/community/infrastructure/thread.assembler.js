import { Thread } from '../domain/model/thread.entity.js';
import {extractResources} from "../../shared/infrastructure/base-assembler.js";

export class ThreadAssembler {
    static toEntityFromResource(resource) {
        return new Thread({ ...resource, id: String(resource.id), communityId: String(resource.communityId) });
    }

    static toEntitiesFromResponse(response) {
        return extractResources(response, 'threads').map(resource => this.toEntityFromResource(resource));
    }
}
