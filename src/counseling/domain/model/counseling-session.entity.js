/**
 * Vocational counseling session between a psychologist and a student (or a group).
 *
 * @class CounselingSession
 */
export class CounselingSession {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?string} [params.id=null] - Session identifier.
     * @param {string} [params.title=''] - Session title.
     * @param {?string} [params.psychologistId=null] - Psychologist identifier.
     * @param {string} [params.psychologistName=''] - Psychologist full name.
     * @param {?string} [params.studentId=null] - Student identifier (individual sessions).
     * @param {?string} [params.groupId=null] - Group identifier (group sessions).
     * @param {string[]} [params.studentIds=[]] - Every student invited to the session.
     * @param {string} [params.target=''] - Student or group name.
     * @param {string} [params.date=''] - Date as dd/mm/yyyy.
     * @param {string} [params.time=''] - Time (e.g. "11:00 AM").
     * @param {'INDIVIDUAL'|'GROUP'} [params.type='INDIVIDUAL'] - Session type.
     * @param {'SCHEDULED'|'COMPLETED'|'CANCELLED'} [params.status='SCHEDULED'] - Session status.
     * @param {string} [params.notes=''] - Previous observations / meeting goal.
     * @param {string} [params.meetLink=''] - Video-call link.
     * @param {number} [params.attendeesCount=1] - Number of attendees.
     */
    constructor({
                    id = null, title = '', psychologistId = null, psychologistName = '', studentId = null, groupId = null,
                    studentIds = [], target = '', date = '', time = '', type = 'INDIVIDUAL', status = 'SCHEDULED', notes = '',
                    meetLink = '', attendeesCount = 1
                } = {}) {
        this.id = id;
        this.title = title;
        this.psychologistId = psychologistId;
        this.psychologistName = psychologistName;
        this.studentId = studentId;
        this.groupId = groupId;
        this.studentIds = studentIds?.length ? studentIds : (studentId ? [studentId] : []);
        this.target = target;
        this.date = date;
        this.time = time;
        this.type = type;
        this.status = status;
        this.notes = notes;
        this.meetLink = meetLink;
        this.attendeesCount = attendeesCount;
    }

    /** @returns {boolean} Whether the session is still scheduled. */
    get isScheduled() {
        return this.status === 'SCHEDULED';
    }

    /** @returns {boolean} Whether it is a group session. */
    get isGroup() {
        return this.type === 'GROUP';
    }

    /** @returns {string} "15/10/2026 - 11:00 AM" */
    get dateTimeLabel() {
        return `${this.date} - ${this.time}`;
    }

    /** @returns {number} Timestamp used to sort sessions chronologically. */
    get timestamp() {
        const [day, month, year] = (this.date || '').split(/[/-]/).map(Number);
        const match = (this.time || '').match(/(\d{1,2}):(\d{2})\s*([ap])?/i);
        let hours = match ? Number(match[1]) : 0;
        const minutes = match ? Number(match[2]) : 0;
        if (match?.[3]?.toLowerCase() === 'p' && hours < 12) hours += 12;
        if (match?.[3]?.toLowerCase() === 'a' && hours === 12) hours = 0;
        return new Date(year || 0, (month || 1) - 1, day || 1, hours, minutes).getTime();
    }

    /**
     * @param {string} studentId
     * @returns {boolean} Whether the student takes part in the session.
     */
    involves(studentId) {
        return this.studentId === studentId || this.studentIds.includes(studentId);
    }

    /** @returns {string} Date for an <input type="date"> (yyyy-mm-dd). */
    get dateInputValue() {
        const [day, month, year] = (this.date || '').split(/[/-]/);
        return year ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : '';
    }

    /** @returns {string} Time for an <input type="time"> (HH:mm). */
    get timeInputValue() {
        if (!this.time) return '';
        const date = new Date(this.timestamp);
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }

    /**
     * @param {string} value - yyyy-mm-dd
     * @returns {string} dd/mm/yyyy
     */
    static formatDate(value) {
        if (!value) return '';
        const [year, month, day] = value.split('-');
        return `${day}/${month}/${year}`;
    }

    /**
     * @param {string} value - HH:mm (24 h)
     * @returns {string} "h:mm AM/PM"
     */
    static formatTime(value) {
        if (!value) return '';
        const [hours, minutes] = value.split(':').map(Number);
        const suffix = hours >= 12 ? 'PM' : 'AM';
        return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${suffix}`;
    }

    /** @returns {string} New Google Meet style link (abc-defg-hij). */
    static generateMeetLink() {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const chunk = size => Array.from({ length: size }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
        return `https://meet.google.com/${chunk(3)}-${chunk(4)}-${chunk(3)}`;
    }
}
