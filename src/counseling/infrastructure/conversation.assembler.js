import { assetPath } from '../../shared/infrastructure/asset-url.js';
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

    /** @param {Conversation} entity @returns {Object} Resource to persist. */
    static toResourceFromEntity(entity) {
        const { id, ...rest } = entity;
        // Avatars are stored without the base path (works locally and in GitHub Pages).
        const resource = { ...rest, studentAvatarUrl: assetPath(rest.studentAvatarUrl), avatarUrl: assetPath(rest.avatarUrl) };
        return id ? { id, ...resource } : resource;
    }
}
