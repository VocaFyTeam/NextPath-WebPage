/**
 * Comment posted in a {@link Thread}.
 *
 * @class Comment
 */
export class Comment {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?string} [params.id=null] - Comment identifier.
     * @param {?string} [params.threadId=null] - Thread identifier.
     * @param {string} [params.authorName=''] - Author display name.
     * @param {string} [params.content=''] - Comment text.
     * @param {string} [params.createdAt=''] - ISO date-time.
     */
    constructor({ id = null, threadId = null, authorName = '', content = '', createdAt = '' } = {}) {
        this.id = id;
        this.threadId = threadId;
        this.authorName = authorName;
        this.content = content;
        this.createdAt = createdAt || new Date().toISOString();
    }

    /**
     * Builds the short author name used in the forum ("Joaquín M.").
     * @param {string} firstName
     * @param {string} lastName
     * @returns {string}
     */
    static displayName(firstName, lastName) {
        return `${firstName} ${lastName ? lastName.charAt(0) + '.' : ''}`.trim();
    }
}