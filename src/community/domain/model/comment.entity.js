
export class Comment {

    constructor({ id = null, threadId = null, authorName = '', content = '', createdAt = '' } = {}) {
        this.id = id;
        this.threadId = threadId;
        this.authorName = authorName;
        this.content = content;
        this.createdAt = createdAt || new Date().toISOString();
    }

    static displayName(firstName, lastName) {
        return `${firstName} ${lastName ? lastName.charAt(0) + '.' : ''}`.trim();
    }
}
