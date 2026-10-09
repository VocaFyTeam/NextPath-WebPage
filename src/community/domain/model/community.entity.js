/**
 * Student community (interest group) of the forum.
 *
 * @class Community
 */
export class Community {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?string} [params.id=null] - Community identifier.
     * @param {string} [params.name=''] - Community name.
     * @param {string[]} [params.memberIds=[]] - Ids of the students that joined.
     */
    constructor({ id = null, name = '', memberIds = [] } = {}) {
        this.id = id;
        this.name = name;
        this.memberIds = memberIds;
    }

    /** @param {string} studentId @returns {boolean} Whether the student belongs to the community. */
    hasMember(studentId) {
        return this.memberIds.includes(studentId);
    }
}