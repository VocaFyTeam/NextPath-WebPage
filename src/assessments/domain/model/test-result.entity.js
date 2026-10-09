import { AffinityProfile } from './affinity-profile.js';

/**
 * Result (attempt) of a vocational test taken by a student.
 *
 * @class TestResult
 */
export class TestResult {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?string} [params.id=null] - Result identifier.
     * @param {?string} [params.studentId=null] - Student identifier.
     * @param {?string} [params.testId=null] - Test identifier.
     * @param {string} [params.date=''] - ISO date (yyyy-mm-dd).
     * @param {string} [params.version='1.0'] - Version of the test taken.
     * @param {'completed'|'pending'} [params.status='pending'] - Attempt status.
     * @param {string} [params.summary=''] - Short description of the result.
     * @param {Object<string, number>} [params.scores={}] - Affinity scores.
     * @param {Array<{careerId: string, compatibility: number}>} [params.careerMatches=[]] - Ranked careers.
     * @param {Object<string, string>|Array} [params.answers={}] - Answers given.
     */
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

    /** @returns {boolean} Whether the attempt was finished. */
    get isCompleted() {
        return this.status === 'completed';
    }

    /** @returns {string} Date formatted as d/m/yyyy (as shown in the mockups). */
    get formattedDate() {
        if (!this.date) return '';
        const [year, month, day] = this.date.split('-').map(Number);
        return `${day}/${month}/${year}`;
    }

    /**
     * @param {string|number} careerId - Career identifier.
     * @returns {?number} Compatibility with the career, if computed.
     */
    compatibilityFor(careerId) {
        return this.careerMatches.find(match => String(match.careerId) === String(careerId))?.compatibility ?? null;
    }

    /**
     * @param {number} [count=3] - Number of careers.
     * @returns {string[]} Ids of the most compatible careers.
     */
    topCareerIds(count = 3) {
        return this.careerMatches.slice(0, count).map(match => String(match.careerId));
    }
}
