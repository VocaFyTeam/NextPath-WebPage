import { VocationalProgress } from '../../../shared/domain/model/vocational-progress.js';
import { RiskPolicy, STUDENT_FLAGS } from './risk-policy.js';

/**
 * Read model of a student followed by a psychologist: identity, group,
 * vocational progress, risk level and latest test results.
 *
 * @class StudentOverview
 */
export class StudentOverview {
    /**
     * @param {Object} params - Attributes.
     * @param {string} params.studentId - Student identifier.
     * @param {string} [params.firstName='']
     * @param {string} [params.lastName='']
     * @param {string} [params.avatarUrl='']
     * @param {?string} [params.groupId=null] - Group of the student.
     * @param {string[]} [params.flags=[]] - Monitoring flags.
     * @param {string} [params.observation=''] - Short note of the psychologist.
     * @param {string} [params.lastActivityDate=''] - ISO date of the last activity.
     * @param {import('../../../assessments/domain/model/test-result.entity.js').TestResult[]} [params.results=[]] - All results of the student.
     * @param {number} [params.totalTests=0] - Tests available in the platform.
     * @param {number} [params.completedTasks=0]
     * @param {number} [params.totalTasks=0]
     * @param {string[]} [params.favoriteCareerIds=[]]
     */
    constructor({
        studentId, firstName = '', lastName = '', avatarUrl = '', groupId = null, flags = [], observation = '',
        lastActivityDate = '', results = [], totalTests = 0, completedTasks = 0, totalTasks = 0, favoriteCareerIds = []
    }) {
        this.studentId = studentId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.avatarUrl = avatarUrl || '/images/avatars/student.svg';
        this.groupId = groupId;
        this.flags = flags;
        this.observation = observation;
        this.lastActivityDate = lastActivityDate;
        this.results = [...results].sort((a, b) => b.date.localeCompare(a.date));
        this.favoriteCareerIds = favoriteCareerIds;

        const completedTests = new Set(this.completedResults.map(result => result.testId)).size;
        this.progress = new VocationalProgress({
            completedTests, totalTests, completedTasks, totalTasks, favorites: favoriteCareerIds.length
        }).percentage;
        this.riskLevel = RiskPolicy.evaluate({ progress: this.progress, flags });
    }

    /** @returns {string} */
    get fullName() {
        return `${this.firstName} ${this.lastName}`.trim();
    }

    /** @returns {import('../../../assessments/domain/model/test-result.entity.js').TestResult[]} */
    get completedResults() {
        return this.results.filter(result => result.isCompleted);
    }

    /** @returns {?import('../../../assessments/domain/model/test-result.entity.js').TestResult} Latest completed result. */
    get latestResult() {
        return this.completedResults[0] ?? null;
    }

    /** @returns {?import('../../../assessments/domain/model/test-result.entity.js').TestResult} Latest result (any status). */
    get lastAttempt() {
        return this.results[0] ?? null;
    }

    /** @returns {boolean} Whether the student has not completed any test. */
    get hasNotStarted() {
        return this.completedResults.length === 0;
    }

    /** @returns {boolean} */
    get hasLowParticipation() {
        return this.flags.includes(STUDENT_FLAGS.LOW_PARTICIPATION);
    }

    /** @returns {boolean} */
    get hasInconsistentAnswers() {
        return this.flags.includes(STUDENT_FLAGS.INCONSISTENT);
    }

    /** @returns {boolean} Student with progress started but not finished. */
    get isInProgress() {
        return this.progress > 0 && this.progress < 100;
    }

    /**
     * @param {Date} [today=new Date()]
     * @returns {number} Days since the last activity.
     */
    daysInactive(today = new Date()) {
        if (!this.lastActivityDate) return 0;
        const [year, month, day] = this.lastActivityDate.split('-').map(Number);
        const last = new Date(year, month - 1, day);
        return Math.max(0, Math.floor((today - last) / 86400000));
    }
}
