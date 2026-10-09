/**
 * Conversation thread published in a community.
 *
 * @class Thread
 */
export class Thread {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?string} [params.id=null] - Thread identifier.
     * @param {?string} [params.communityId=null] - Community identifier.
     * @param {string} [params.authorName=''] - Author display name (e.g. "Camila R.").
     * @param {string} [params.content=''] - Thread text.
     * @param {number} [params.commentsCount=0] - Number of comments.
     * @param {string} [params.createdAt=''] - ISO date-time.
     */
    constructor({ id = null, communityId = null, authorName = '', content = '', commentsCount = 0, createdAt = '' } = {}) {
        this.id = id;
        this.communityId = communityId;
        this.authorName = authorName;
        this.content = content;
        this.commentsCount = commentsCount;
        this.createdAt = createdAt;
    }
}