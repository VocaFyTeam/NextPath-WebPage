export class VocationalTest {

    constructor({
                    id = null, title = '', shortName = '', headline = '', description = '', instructions = '',
                    type = 'choice', featured = false, order = 0, version = '1.0', durationMinutes = 0
                } = {}) {
        this.id = id;
        this.title = title;
        this.shortName = shortName || title;
        this.headline = headline || title.toUpperCase();
        this.description = description;
        this.instructions = instructions;
        this.type = type;
        this.featured = featured;
        this.order = order;
        this.version = version;
        this.durationMinutes = durationMinutes;
    }

    get isOpenEnded() {
        return this.type === 'open';
    }

    getProgress(currentIndex, totalQuestions) {
        if (!totalQuestions) return 0;
        return Math.round(((currentIndex + 1) / totalQuestions) * 100);
    }
}