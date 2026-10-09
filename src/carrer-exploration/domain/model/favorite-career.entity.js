
export class FavoriteCareer {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?string} [params.id=null] - Favorite identifier.
     * @param {?string} [params.studentId=null] - Student identifier.
     * @param {?string} [params.careerId=null] - Career identifier.
     */
    constructor({ id = null, studentId = null, careerId = null } = {}) {
        this.id = id;
        this.studentId = studentId;
        this.careerId = careerId;
    }
}
