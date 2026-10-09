
export class CounselingSession {

    constructor({
                    id = null, title = '', psychologistId = null, psychologistName = '', studentId = null, target = '',
                    date = '', time = '', type = 'INDIVIDUAL', status = 'SCHEDULED', notes = '', meetLink = '', attendeesCount = 1
                } = {}) {
        this.id = id;
        this.title = title;
        this.psychologistId = psychologistId;
        this.psychologistName = psychologistName;
        this.studentId = studentId;
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
}
