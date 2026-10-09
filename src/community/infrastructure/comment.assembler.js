import { Comment } from '../domain/model/comment.entity.js';
import {extractResources} from "../../shared/infrastructure/base-assembler.js";

export class CommentAssembler {
    static toEntityFromResource(resource) {
        return new Comment({ ...resource, id: String(resource.id), threadId: String(resource.threadId) });
    }
    static toEntitiesFromResponse(response) {
        return extractResources(response, 'comments').map(resource => this.toEntityFromResource(resource));
    }

    static toResourceFromEntity(entity) {
        return { threadId: entity.threadId, authorName: entity.authorName, content: entity.content, createdAt: entity.createdAt };
    }
}
