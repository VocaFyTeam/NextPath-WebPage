import { assetUrl } from '../../../shared/infrastructure/asset-url.js';
import { VocationalProgress } from '../../../shared/domain/model/vocational-progress.js';
import { RiskPolicy, STUDENT_FLAGS } from './risk-policy.js';


export class StudentOverview {

    constructor({
                    studentId, firstName = '', lastName = '', avatarUrl = '', groupId = null, flags = [], observation = '',
                    lastActivityDate = '', results = [], totalTests = 0, completedTasks = 0, totalTasks = 0, favoriteCareerIds = []
                }) {
        this.studentId = studentId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.avatarUrl = assetUrl(avatarUrl || '/images/avatars/student.svg');
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

    get fullName() {
        return `${this.firstName} ${this.lastName}`.trim();
    }

    get completedResults() {
        return this.results.filter(result => result.isCompleted);
    }

    get latestResult() {
        return this.completedResults[0] ?? null;
    }

    get lastAttempt() {
        return this.results[0] ?? null;
    }

    get hasNotStarted() {
        return this.completedResults.length === 0;
    }

    get hasLowParticipation() {
        return this.flags.includes(STUDENT_FLAGS.LOW_PARTICIPATION);
    }

    get hasInconsistentAnswers() {
        return this.flags.includes(STUDENT_FLAGS.INCONSISTENT);
    }

    get isInProgress() {
        return this.progress > 0 && this.progress < 100;
    }


    daysInactive(today = new Date()) {
        if (!this.lastActivityDate) return 0;
        const [year, month, day] = this.lastActivityDate.split('-').map(Number);
        const last = new Date(year, month - 1, day);
        return Math.max(0, Math.floor((today - last) / 86400000));
    }
}
