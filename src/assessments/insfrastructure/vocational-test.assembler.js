import {VocationalTest} from "../domain/model/vocational-test.entity.js";
import {extractResources} from '../../shared/infrastructure/base-assembler.js';

export class VocationalTestAssembler {
    static toEntityFromResource(resource) {
        return new VocationalTest({ ...resource, id: String(resource.id) });
    }

    static toEntitiesFromResponse(response) {
        return extractResources(response, 'vocational-tests').map(resource => this.toEntityFromResource(resource));
    }
}
