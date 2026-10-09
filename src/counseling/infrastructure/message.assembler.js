import { Message } from '../domain/model/message.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';

/**
 * Maps message resources into domain entities and back.
 *
 * @class MessageAssembler
 */
export class MessageAssembler {
    /** @param {Object} resource @returns {Message} */
    static toEntityFromResource(resource) {
        return new Message({ ...resource, id: String(resource.id), conversationId: String(resource.conversationId) });
    }

    /** @param {import('axios').AxiosResponse} response @returns {Message[]} */
    static toEntitiesFromResponse(response) {
        return extractResources(response, 'messages').map(resource => this.toEntityFromResource(resource));
    }

    /** @param {Message} entity @returns {Object} */
    static toResourceFromEntity(entity) {
        return {
            conversationId: entity.conversationId,
            senderRole: entity.senderRole,
            text: entity.text,
            sentAt: entity.sentAt,
            read: entity.read,
            ...(entity.attachment ? { attachment: entity.attachment } : {})
        };
    }
}
