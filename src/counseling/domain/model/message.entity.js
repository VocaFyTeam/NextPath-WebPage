
export class Message {

    constructor({ id = null, conversationId = null, senderRole = 'student', text = '', sentAt = '', read = false, attachment = null } = {}) {
        this.id = id;
        this.conversationId = conversationId;
        this.senderRole = senderRole;
        this.text = text;
        this.sentAt = sentAt || new Date().toISOString();
        this.read = read;
        this.attachment = attachment;
    }

    get isFromStudent() {
        return this.senderRole === 'student';
    }
r(viewerRole) {
        return this.senderRole === viewerRole;
    }
}
