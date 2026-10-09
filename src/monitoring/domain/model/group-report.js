import { AFFINITY_DIMENSIONS } from '../../../assessments/domain/model/affinity-profile.js';

/**
 * Domain service that builds the "Comparación de perfiles entre grupos" report (mock-up 14).
 *
 * @class GroupReport
 */
export class GroupReport {
    /**
     * Percentage of preference of a group for each affinity dimension:
     * average score of the latest result of each student, normalised so the
     * five dimensions add up to 100%.
     *
     * @param {import('./student-overview.entity.js').StudentOverview[]} students - Students of the group.
     * @returns {Object<string, number>} Percentage per dimension.
     */
    static dimensionShares(students) {
        const profiles = students.map(student => student.latestResult?.profile).filter(Boolean);
        const empty = Object.fromEntries(AFFINITY_DIMENSIONS.map(dimension => [dimension, 0]));
        if (!profiles.length) return empty;

        const averages = Object.fromEntries(AFFINITY_DIMENSIONS.map(dimension =>
            [dimension, profiles.reduce((sum, profile) => sum + profile[dimension], 0) / profiles.length]));
        const total = Object.values(averages).reduce((sum, value) => sum + value, 0) || 1;
        return Object.fromEntries(AFFINITY_DIMENSIONS.map(dimension => [dimension, Math.round((averages[dimension] / total) * 100)]));
    }

    /**
     * Careers most demanded by a set of students: each student "votes" for the
     * most compatible career of the latest result and for each favorite career.
     *
     * @param {import('./student-overview.entity.js').StudentOverview[]} students
     * @returns {Array<{careerId: string, percentage: number}>} Careers sorted by preference.
     */
    static careerDemand(students) {
        const votes = new Map();
        const vote = careerId => votes.set(careerId, (votes.get(careerId) ?? 0) + 1);
        students.forEach(student => {
            const top = student.latestResult?.topCareerIds(1)[0];
            if (top) vote(top);
            student.favoriteCareerIds.forEach(vote);
        });
        const total = [...votes.values()].reduce((sum, value) => sum + value, 0) || 1;
        return [...votes.entries()]
            .map(([careerId, count]) => ({ careerId, percentage: Math.round((count / total) * 100) }))
            .sort((a, b) => b.percentage - a.percentage);
    }

    /**
     * @param {import('./student-overview.entity.js').StudentOverview[]} students
     * @param {string[]} dimensions - Two dimensions to look for.
     * @returns {number} % of students whose two strongest dimensions include any of the given ones.
     */
    static shareWithDominant(students, dimensions) {
        const evaluated = students.filter(student => student.latestResult);
        if (!evaluated.length) return 0;
        const matching = evaluated.filter(student =>
            student.latestResult.profile.dominantDimensions(2).some(dimension => dimensions.includes(dimension)));
        return Math.round((matching.length / evaluated.length) * 100);
    }

    /**
     * @param {Object<string, number>} shares - Output of dimensionShares.
     * @param {number} [count=2]
     * @returns {string[]} Dimensions with the highest share.
     */
    static topDimensions(shares, count = 2) {
        return [...AFFINITY_DIMENSIONS].sort((a, b) => shares[b] - shares[a]).slice(0, count);
    }

    /**
     * @param {Object<string, number>} first - Shares of the first group.
     * @param {Object<string, number>} second - Shares of the second group.
     * @returns {string} Dimension where the first group stands out the most compared to the second.
     */
    static biggestAdvantage(first, second) {
        return [...AFFINITY_DIMENSIONS].sort((a, b) => (first[b] - second[b]) - (first[a] - second[a]))[0];
    }
}
