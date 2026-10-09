import { assetUrl } from '../../../shared/infrastructure/asset-url.js';

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
     * @param {string} [params.studentName=''] - Student full name.
     * @param {string} [params.studentAvatarUrl=''] - Student avatar.
     * @param {?string} [params.psychologistId=null] - Psychologist identifier.
     * @param {string} [params.psychologistName=''] - Psychologist full name.
     * @param {string} [params.avatarUrl=''] - Psychologist avatar.
     */
    constructor({
        id = null, studentId = null, studentName = '', studentAvatarUrl = '',
        psychologistId = null, psychologistName = '', avatarUrl = ''
    } = {}) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentAvatarUrl = assetUrl(studentAvatarUrl || '/images/avatars/student.svg');
        this.psychologistId = psychologistId;
        this.psychologistName = psychologistName;
        this.avatarUrl = assetUrl(avatarUrl || '/images/avatars/psychologist.svg');
    }

    /**
     * @param {'student'|'psychologist'} viewerRole - Who is looking at the conversation.
     * @returns {{name: string, avatarUrl: string}} The other participant.
     */
    counterpart(viewerRole) {
        return viewerRole === 'psychologist'
            ? { name: this.studentName, avatarUrl: this.studentAvatarUrl }
            : { name: this.psychologistName, avatarUrl: this.avatarUrl };
    }
}
