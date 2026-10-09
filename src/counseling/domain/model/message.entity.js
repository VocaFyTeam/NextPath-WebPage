/**
 * Message inside a {@link Conversation}.
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
     */
    constructor({ id = null, conversationId = null, senderRole = 'student', text = '', sentAt = '', read = false } = {}) {
        this.id = id;
        this.conversationId = conversationId;
        this.senderRole = senderRole;
        this.text = text;
        this.sentAt = sentAt || new Date().toISOString();
        this.read = read;
    }

    /** @returns {boolean} Whether the message was sent by the student. */
    get isFromStudent() {
        return this.senderRole === 'student';
    }
}
