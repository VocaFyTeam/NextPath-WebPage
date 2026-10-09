
export class StudentTask {

    constructor({ id = null, studentId = null, title = '', status = 'pending', dueDate = null, order = 0 } = {}) {
        this.id = id;
        this.studentId = studentId;
        this.title = title;
        this.status = status;
        this.dueDate = dueDate;
        this.order = order;
    }

    get isCompleted() {
        return this.status === 'completed';
    }

    get formattedDueDate() {
        if (!this.dueDate) return '';
        const [year, month, day] = this.dueDate.split('-').map(Number);
        return `${day}/${month}/${year}`;
    }

    get toggledStatus() {
        return this.isCompleted ? 'pending' : 'completed';
    }
}
