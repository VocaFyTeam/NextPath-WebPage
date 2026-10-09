import { Conversation } from '../domain/model/conversation.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';

/**
 * Maps conversation resources into domain entities.
 *
 * @class ConversationAssembler
 */
export class ConversationAssembler {
    /** @param {Object} resource @returns {Conversation} */
    static toEntityFromResource(resource) {
        return new Conversation({ ...resource, id: String(resource.id) });
    }

    /** @param {import('axios').AxiosResponse} response @returns {Conversation[]} */
    static toEntitiesFromResponse(response) {
        return extractResources(response, 'conversations').map(resource => this.toEntityFromResource(resource));
    }
}
