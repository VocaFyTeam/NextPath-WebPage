/**
 * Affinity dimensions used by NextPath, in the order they are drawn in the radar chart
 * (clockwise starting at the top).
 * @type {string[]}
 */
export const AFFINITY_DIMENSIONS = ['artistic', 'social', 'investigative', 'enterprising', 'conventional'];

/** Holland letter for each dimension. */
export const DIMENSION_CODES = {
    artistic: 'A',
    social: 'S',
    investigative: 'I',
    enterprising: 'E',
    conventional: 'C'
};

/**
 * Value object with the 0-100 score of a student in each affinity dimension.
 *
 * @class AffinityProfile
 */
export class AffinityProfile {
    /**
     * @param {Object<string, number>} [scores={}] - Score per dimension (0-100).
     */
    constructor(scores = {}) {
        AFFINITY_DIMENSIONS.forEach(dimension => {
            const value = Number(scores?.[dimension] ?? 0);
            this[dimension] = Math.max(0, Math.min(100, Math.round(value)));
        });
        Object.freeze(this);
    }

    /** @returns {boolean} Whether the profile has any score. */
    get isEmpty() {
        return AFFINITY_DIMENSIONS.every(dimension => this[dimension] === 0);
    }

    /** @returns {Object<string, number>} Plain scores object. */
    toJSON() {
        return Object.fromEntries(AFFINITY_DIMENSIONS.map(dimension => [dimension, this[dimension]]));
    }

    /**
     * @param {number} [count=2] - Number of dimensions to return.
     * @returns {string[]} Dimensions with the highest scores.
     */
    dominantDimensions(count = 2) {
        return [...AFFINITY_DIMENSIONS].sort((a, b) => this[b] - this[a]).slice(0, count);
    }

    /** @returns {string} Three-letter Holland-style code (e.g. "ASI"). */
    get hollandCode() {
        return this.dominantDimensions(3).map(dimension => DIMENSION_CODES[dimension]).join('');
    }

    /**
     * Compatibility between this profile and the ideal profile of a career.
     * It is 100 minus the mean absolute difference between both profiles.
     *
     * @param {Object<string, number>} careerProfile - Ideal scores of a career.
     * @returns {number} Compatibility percentage (0-100).
     */
    compatibilityWith(careerProfile) {
        const difference = AFFINITY_DIMENSIONS
            .reduce((sum, dimension) => sum + Math.abs(this[dimension] - (careerProfile?.[dimension] ?? 0)), 0);
        return Math.max(0, Math.min(100, Math.round(100 - difference / AFFINITY_DIMENSIONS.length)));
    }
}
