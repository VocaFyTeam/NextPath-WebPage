/** Risk levels used by the psychologist dashboard. */
export const RISK_LEVELS = ['high', 'medium', 'low'];

/** Flags a psychologist (or the platform) can attach to a student. */
export const STUDENT_FLAGS = {
    INACTIVITY: 'inactivity',
    INCONSISTENT: 'inconsistent',
    LOW_PARTICIPATION: 'lowParticipation'
};

/**
 * Domain policy that decides the vocational risk level of a student.
 *
 * - High: inactive, inconsistent answers, or progress under 30%.
 * - Medium: progress under 75%.
 * - Low: otherwise.
 *
 * @class RiskPolicy
 */
export class RiskPolicy {
    static HIGH_PROGRESS_LIMIT = 30;
    static MEDIUM_PROGRESS_LIMIT = 75;

    /**
     * @param {Object} params
     * @param {number} params.progress - Vocational progress (0-100).
     * @param {string[]} [params.flags=[]] - Flags of the student.
     * @returns {'high'|'medium'|'low'}
     */
    static evaluate({ progress, flags = [] }) {
        if (flags.includes(STUDENT_FLAGS.INACTIVITY) || flags.includes(STUDENT_FLAGS.INCONSISTENT)) return 'high';
        if (progress < RiskPolicy.HIGH_PROGRESS_LIMIT) return 'high';
        if (progress < RiskPolicy.MEDIUM_PROGRESS_LIMIT) return 'medium';
        return 'low';
    }
}
