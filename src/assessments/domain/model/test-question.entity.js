
export class TestQuestion {

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

    get isOpen() {
        return this.type === 'open';
    }

    isAnswered(answer) {
        if (this.isOpen) return typeof answer === 'string' && answer.trim().length >= 3;
        return this.options.some(option => option.id === answer);
    }
}
