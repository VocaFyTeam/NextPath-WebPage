import { AffinityProfile } from './affinity-profile.js';


export class TestResult {

    constructor({
        id = null, studentId = null, testId = null, date = '', version = '1.0', status = 'pending',
        summary = '', scores = {}, careerMatches = [], answers = {}
    } = {}) {
        this.id = id;
        this.studentId = studentId;
        this.testId = testId;
        this.date = date;
        this.version = version;
        this.status = status;
        this.summary = summary;
        this.profile = new AffinityProfile(scores);
        this.careerMatches = careerMatches;
        this.answers = Array.isArray(answers) ? {} : answers;
    }

    get isCompleted() {
        return this.status === 'completed';
    }

    get formattedDate() {
        if (!this.date) return '';
        const [year, month, day] = this.date.split('-').map(Number);
        return `${day}/${month}/${year}`;
    }


    compatibilityFor(careerId) {
        return this.careerMatches.find(match => String(match.careerId) === String(careerId))?.compatibility ?? null;
    }

    topCareerIds(count = 3) {
        return this.careerMatches.slice(0, count).map(match => String(match.careerId));
    }
}
