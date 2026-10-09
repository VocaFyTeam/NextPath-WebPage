
export const AFFINITY_DIMENSIONS = ['artistic', 'social', 'investigative', 'enterprising', 'conventional'];

export const DIMENSION_CODES = {
    artistic: 'A',
    social: 'S',
    investigative: 'I',
    enterprising: 'E',
    conventional: 'C'
};


export class AffinityProfile {

    constructor(scores = {}) {
        AFFINITY_DIMENSIONS.forEach(dimension => {
            const value = Number(scores?.[dimension] ?? 0);
            this[dimension] = Math.max(0, Math.min(100, Math.round(value)));
        });
        Object.freeze(this);
    }

    get isEmpty() {
        return AFFINITY_DIMENSIONS.every(dimension => this[dimension] === 0);
    }

    toJSON() {
        return Object.fromEntries(AFFINITY_DIMENSIONS.map(dimension => [dimension, this[dimension]]));
    }

    dominantDimensions(count = 2) {
        return [...AFFINITY_DIMENSIONS].sort((a, b) => this[b] - this[a]).slice(0, count);
    }

    get hollandCode() {
        return this.dominantDimensions(3).map(dimension => DIMENSION_CODES[dimension]).join('');
    }

    compatibilityWith(careerProfile) {
        const difference = AFFINITY_DIMENSIONS
            .reduce((sum, dimension) => sum + Math.abs(this[dimension] - (careerProfile?.[dimension] ?? 0)), 0);
        return Math.max(0, Math.min(100, Math.round(100 - difference / AFFINITY_DIMENSIONS.length)));
    }
}
