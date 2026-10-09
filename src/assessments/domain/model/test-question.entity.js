/**
 * Question that belongs to a vocational test.
 *
 * @class TestQuestion
 */
export class TestQuestion {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?string} [params.id=null] - Question identifier.
     * @param {?string} [params.testId=null] - Owner test identifier.
     * @param {number} [params.order=0] - Position inside the test.
     * @param {'open'|'choice'} [params.type='choice'] - Answer style.
     * @param {string} [params.text=''] - Question statement.
     * @param {?string} [params.area=null] - Affinity dimension the open question explores.
     * @param {string} [params.placeholder=''] - Placeholder for open answers.
     * @param {Array<{id: string, text: string, area: string}>} [params.options=[]] - Options for choice questions.
     */
    constructor({ id = null, testId = null, order = 0, type = 'choice', text = '', area = null, placeholder = '', options = [] } = {}) {
        this.id = id;
        this.testId = testId;
        this.order = order;
        this.type = type;
        this.text = text;
        this.area = area;
        this.placeholder = placeholder;
        this.options = options;
    }

    /** @returns {boolean} Whether the question expects free text. */
    get isOpen() {
        return this.type === 'open';
    }

    /**
     * @param {string|undefined} answer - Answer given by the student.
     * @returns {boolean} Whether the answer is acceptable.
     */
    isAnswered(answer) {
        if (this.isOpen) return typeof answer === 'string' && answer.trim().length >= 3;
        return this.options.some(option => option.id === answer);
    }
}
