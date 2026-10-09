import { assetUrl } from '../../../shared/infrastructure/asset-url.js';

/**
 * Message inside a {@link Conversation}. It may carry a shared vocational resource.
 *
 * @class Message
 */
export class Message {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?string} [params.id=null] - Message identifier.
     * @param {?string} [params.conversationId=null] - Conversation identifier.
     * @param {'student'|'psychologist'} [params.senderRole='student'] - Who sent the message.
     * @param {string} [params.text=''] - Message body.
     * @param {string} [params.sentAt=''] - ISO date-time.
     * @param {boolean} [params.read=false] - Whether the receiver has read it.
     * @param {?{resourceId: string, title: string, coverUrl: string, fileUrl: string}} [params.attachment=null] - Shared resource.
     */
    constructor({ id = null, conversationId = null, senderRole = 'student', text = '', sentAt = '', read = false, attachment = null } = {}) {
        this.id = id;
        this.conversationId = conversationId;
        this.senderRole = senderRole;
        this.text = text;
        this.sentAt = sentAt || new Date().toISOString();
        this.read = read;
        this.attachment = attachment
            ? { ...attachment, coverUrl: assetUrl(attachment.coverUrl), fileUrl: assetUrl(attachment.fileUrl) }
            : null;
    }

    /** @returns {boolean} Whether the message was sent by the student. */
    get isFromStudent() {
        return this.senderRole === 'student';
    }

    /**
     * @param {'student'|'psychologist'} viewerRole
     * @returns {boolean} Whether the viewer wrote this message.
     */
    isOwnFor(viewerRole) {
        return this.senderRole === viewerRole;
    }
}
