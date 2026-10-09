
export class VocationalProgress {
    static TEST_WEIGHT = 0.5;
    static TASK_WEIGHT = 0.3;
    static FAVORITES_WEIGHT = 0.2;
    static FAVORITES_GOAL = 3;

    constructor({ completedTests = 0, totalTests = 0, completedTasks = 0, totalTasks = 0, favorites = 0 } = {}) {
        const ratio = (done, total) => (total > 0 ? Math.min(done / total, 1) : 0);
        const value =
            ratio(completedTests, totalTests) * VocationalProgress.TEST_WEIGHT +
            ratio(completedTasks, totalTasks) * VocationalProgress.TASK_WEIGHT +
            ratio(favorites, VocationalProgress.FAVORITES_GOAL) * VocationalProgress.FAVORITES_WEIGHT;
        this.percentage = Math.round(value * 100);
    }
}
