
export class Community {

    constructor({ id = null, name = '', memberIds = [] } = {}) {
        this.id = id;
        this.name = name;
        this.memberIds = memberIds;
    }

    hasMember(studentId) {
        return this.memberIds.includes(studentId);
    }
}
