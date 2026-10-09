/**
 * Task of the student's recommended action plan.
 *
 * @class StudentTask
 */
export class StudentTask {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?string} [params.id=null] - Task identifier.
     * @param {?string} [params.studentId=null] - Student identifier.
     * @param {string} [params.title=''] - Task description.
     * @param {'pending'|'completed'} [params.status='pending'] - Task status.
     * @param {?string} [params.dueDate=null] - ISO due date (yyyy-mm-dd).
     * @param {number} [params.order=0] - Display order.
     */
    constructor({ id = null, studentId = null, title = '', status = 'pending', dueDate = null, order = 0 } = {}) {
        this.id = id;
        this.studentId = studentId;
        this.title = title;
        this.status = status;
        this.dueDate = dueDate;
        this.order = order;
    }

    /** @returns {boolean} Whether the task was completed. */
    get isCompleted() {
        return this.status === 'completed';
    }

    /** @returns {string} Due date as d/m/yyyy. */
    get formattedDueDate() {
        if (!this.dueDate) return '';
        const [year, month, day] = this.dueDate.split('-').map(Number);
        return `${day}/${month}/${year}`;
    }

    /** @returns {'pending'|'completed'} Status after toggling. */
    get toggledStatus() {
        return this.isCompleted ? 'pending' : 'completed';
    }
}