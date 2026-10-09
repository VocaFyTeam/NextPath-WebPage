/**
 * Direct-message conversation between a student and a psychologist.
 *
 * @class Conversation
 */
export class Conversation {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?string} [params.id=null] - Conversation identifier.
     * @param {?string} [params.studentId=null] - Student identifier.
     * @param {?string} [params.psychologistId=null] - Psychologist identifier.
     * @param {string} [params.psychologistName=''] - Psychologist full name.
     * @param {string} [params.avatarUrl=''] - Psychologist avatar.
     */
    constructor({ id = null, studentId = null, psychologistId = null, psychologistName = '', avatarUrl = '' } = {}) {
        this.id = id;
        this.studentId = studentId;
        this.psychologistId = psychologistId;
        this.psychologistName = psychologistName;
        this.avatarUrl = avatarUrl || '/images/avatars/psychologist.svg';
    }
}
