import { AFFINITY_DIMENSIONS, AffinityProfile } from './affinity-profile.js';

/**
 * Keywords (stems, without accents) that reveal interest in each dimension
 * when they appear in open answers of the NextPath (IA) test.
 */
const KEYWORDS = {
    artistic: ['dibuj', 'disen', 'pint', 'arte', 'artist', 'music', 'crea', 'foto', 'video', 'escrib', 'color',
        'ilustr', 'imagin', 'cine', 'moda', 'decor', 'esteti', 'visual', 'animac', 'tocar', 'cant', 'baile', 'teatro'],
    social: ['ayud', 'ensen', 'amig', 'escuch', 'equipo', 'person', 'comunidad', 'volunt', 'compart', 'cuid',
        'acompan', 'conversa', 'grupo', 'social', 'nino', 'famil', 'apoy', 'emocion', 'empat'],
    investigative: ['investig', 'cienci', 'analiz', 'matemat', 'logic', 'program', 'experiment', 'descubr', 'estudi',
        'resolver', 'problema', 'datos', 'tecnolog', 'fisic', 'quimic', 'biolog', 'curios', 'leer', 'computad'],
    enterprising: ['lider', 'negocio', 'vend', 'empres', 'emprend', 'dirig', 'organiz', 'convenc', 'debat', 'gan',
        'meta', 'proyecto', 'decid', 'compet', 'dinero', 'marketing', 'coordin'],
    conventional: ['orden', 'planific', 'archiv', 'registr', 'contab', 'precis', 'detall', 'norma', 'agenda', 'lista',
        'calcul', 'administr', 'estructur', 'puntual', 'metod', 'excel']
};

/** Baseline points a question gives to the dimension it explores. */
const QUESTION_AREA_WEIGHT = 1;
/** Minimum score so the radar never collapses to a single point. */
const MIN_SCORE = 20;

/**
 * @param {string} text - Raw text.
 * @returns {string} Lower-case text without accents.
 */
function normalize(text) {
    return (text ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Domain service that turns the answers of a test into an {@link AffinityProfile}
 * and ranks careers by compatibility.
 *
 * @class AffinityAnalyzer
 */
export class AffinityAnalyzer {
    /**
     * @param {import('./test-question.entity.js').TestQuestion[]} questions - Questions of the test.
     * @param {Object<string, string>} answers - Answer per question id (option id or free text).
     * @returns {AffinityProfile} Resulting profile.
     */
    static analyze(questions, answers) {
        const raw = Object.fromEntries(AFFINITY_DIMENSIONS.map(dimension => [dimension, 0]));

        questions.forEach(question => {
            const answer = answers[question.id];
            if (!question.isAnswered(answer)) return;

            if (question.isOpen) {
                if (question.area && raw[question.area] !== undefined) raw[question.area] += QUESTION_AREA_WEIGHT;
                const text = normalize(answer);
                AFFINITY_DIMENSIONS.forEach(dimension => {
                    KEYWORDS[dimension].forEach(stem => {
                        if (text.includes(stem)) raw[dimension] += 1;
                    });
                });
            } else {
                const option = question.options.find(o => o.id === answer);
                if (option && raw[option.area] !== undefined) raw[option.area] += 2;
            }
        });

        const max = Math.max(...Object.values(raw), 1);
        const scores = Object.fromEntries(AFFINITY_DIMENSIONS.map(dimension =>
            [dimension, MIN_SCORE + (raw[dimension] / max) * (100 - MIN_SCORE)]));
        return new AffinityProfile(scores);
    }

    /**
     * @param {AffinityProfile} profile - Student profile.
     * @param {Array<{id: string, profile: Object<string, number>}>} careers - Careers with their ideal profile.
     * @returns {Array<{careerId: string, compatibility: number}>} Careers sorted by compatibility.
     */
    static matchCareers(profile, careers) {
        return careers
            .map(career => ({ careerId: String(career.id), compatibility: profile.compatibilityWith(career.profile) }))
            .sort((a, b) => b.compatibility - a.compatibility);
    }
}
