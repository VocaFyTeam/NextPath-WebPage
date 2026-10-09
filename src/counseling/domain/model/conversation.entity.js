
export class Conversation {

    constructor({
                    id = null, studentId = null, studentName = '', studentAvatarUrl = '',
                    psychologistId = null, psychologistName = '', avatarUrl = ''
                } = {}) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentAvatarUrl = studentAvatarUrl || '/images/avatars/student.svg';
        this.psychologistId = psychologistId;
        this.psychologistName = psychologistName;
        this.avatarUrl = avatarUrl || '/images/avatars/psychologist.svg';
    }

    counterpart(viewerRole) {
        return viewerRole === 'psychologist'
            ? { name: this.studentName, avatarUrl: this.studentAvatarUrl }
            : { name: this.psychologistName, avatarUrl: this.avatarUrl };
    }
}
