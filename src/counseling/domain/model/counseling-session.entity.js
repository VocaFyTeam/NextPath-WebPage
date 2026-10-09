
export class CounselingSession {

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

    get isScheduled() {
        return this.status === 'SCHEDULED';
    }

    get isGroup() {
        return this.type === 'GROUP';
    }

    get dateTimeLabel() {
        return `${this.date} - ${this.time}`;
    }

    get timestamp() {
        const [day, month, year] = (this.date || '').split(/[/-]/).map(Number);
        const match = (this.time || '').match(/(\d{1,2}):(\d{2})\s*([ap])?/i);
        let hours = match ? Number(match[1]) : 0;
        const minutes = match ? Number(match[2]) : 0;
        if (match?.[3]?.toLowerCase() === 'p' && hours < 12) hours += 12;
        if (match?.[3]?.toLowerCase() === 'a' && hours === 12) hours = 0;
        return new Date(year || 0, (month || 1) - 1, day || 1, hours, minutes).getTime();
    }


    involves(studentId) {
        return this.studentId === studentId || this.studentIds.includes(studentId);
    }

    get dateInputValue() {
        const [day, month, year] = (this.date || '').split(/[/-]/);
        return year ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : '';
    }

    get timeInputValue() {
        if (!this.time) return '';
        const date = new Date(this.timestamp);
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }


    static formatDate(value) {
        if (!value) return '';
        const [year, month, day] = value.split('-');
        return `${day}/${month}/${year}`;
    }


    static formatTime(value) {
        if (!value) return '';
        const [hours, minutes] = value.split(':').map(Number);
        const suffix = hours >= 12 ? 'PM' : 'AM';
        return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${suffix}`;
    }

    static generateMeetLink() {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const chunk = size => Array.from({ length: size }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
        return `https://meet.google.com/${chunk(3)}-${chunk(4)}-${chunk(3)}`;
    }
}
