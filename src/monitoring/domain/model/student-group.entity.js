/**
 * Group of students followed by a psychologist (e.g. "Grupo A").
 *
 * @class StudentGroup
 */
export class StudentGroup {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?string} [params.id=null] - Group identifier ("A", "B"...).
     * @param {string} [params.name=''] - Display name.
     * @param {string} [params.description=''] - Short description.
     * @param {?string} [params.psychologistId=null] - Owner psychologist.
     */
    constructor({ id = null, name = '', description = '', psychologistId = null } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.psychologistId = psychologistId;
    }
}
