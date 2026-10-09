
export class Thread {

    constructor({ id = null, communityId = null, authorName = '', content = '', commentsCount = 0, createdAt = '' } = {}) {
        this.id = id;
        this.communityId = communityId;
        this.authorName = authorName;
        this.content = content;
        this.commentsCount = commentsCount;
        this.createdAt = createdAt;
    }
}
