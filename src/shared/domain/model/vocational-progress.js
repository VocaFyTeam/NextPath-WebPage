/**
 * Shared-kernel value object that summarises how far a student is in the
 * vocational orientation process. Weights:
 *  - 50% vocational tests completed
 *  - 30% action-plan tasks completed
 *  - 20% favorite careers saved (3 or more = complete)
 *
 * @class VocationalProgress
 */
export class VocationalProgress {
    static TEST_WEIGHT = 0.5;
    static TASK_WEIGHT = 0.3;
    static FAVORITES_WEIGHT = 0.2;
    static FAVORITES_GOAL = 3;

    /**
     * @param {Object} params
     * @param {number} params.completedTests - Distinct tests completed.
     * @param {number} params.totalTests - Tests available.
     * @param {number} params.completedTasks - Tasks completed.
     * @param {number} params.totalTasks - Tasks assigned.
     * @param {number} params.favorites - Careers saved as favorite.
     */
    constructor({ completedTests = 0, totalTests = 0, completedTasks = 0, totalTasks = 0, favorites = 0 } = {}) {
        const ratio = (done, total) => (total > 0 ? Math.min(done / total, 1) : 0);
        const value =
            ratio(completedTests, totalTests) * VocationalProgress.TEST_WEIGHT +
            ratio(completedTasks, totalTasks) * VocationalProgress.TASK_WEIGHT +
            ratio(favorites, VocationalProgress.FAVORITES_GOAL) * VocationalProgress.FAVORITES_WEIGHT;
        this.percentage = Math.round(value * 100);
    }
}
