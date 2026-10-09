import { AFFINITY_DIMENSIONS, AffinityProfile } from './affinity-profile.js';

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

const QUESTION_AREA_WEIGHT = 1;
const MIN_SCORE = 20;
function normalize(text) {
    return (text ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export class AffinityAnalyzer {

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

    static matchCareers(profile, careers) {
        return careers
            .map(career => ({ careerId: String(career.id), compatibility: profile.compatibilityWith(career.profile) }))
            .sort((a, b) => b.compatibility - a.compatibility);
    }
}
