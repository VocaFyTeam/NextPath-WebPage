import { Comment } from '../domain/model/comment.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';

/**
 * Maps comment resources into domain entities and back.
 *
 * @class CommentAssembler
 */
export class CommentAssembler {
    /** @param {Object} resource @returns {Comment} */
    static toEntityFromResource(resource) {
        return new Comment({ ...resource, id: String(resource.id), threadId: String(resource.threadId) });
    }

    /** @param {import('axios').AxiosResponse} response @returns {Comment[]} */
    static toEntitiesFromResponse(response) {
        return extractResources(response, 'comments').map(resource => this.toEntityFromResource(resource));
    }

    /** @param {Comment} entity @returns {Object} */
    static toResourceFromEntity(entity) {
        return { threadId: entity.threadId, authorName: entity.authorName, content: entity.content, createdAt: entity.createdAt };
    }
}