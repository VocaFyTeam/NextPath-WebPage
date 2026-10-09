import { useI18n } from 'vue-i18n';
import { DIMENSION_CODES } from '../domain/model/affinity-profile.js';

export function useResultInterpretation() {
    const { t } = useI18n();

    function studentFeedback(profile) {
        const [first, second] = profile.dominantDimensions(2);
        if (!first || !second) return [];
        return [
            t('results.interpretationIntro', {
                first: t(`dimensions.${first}.name`), firstCode: DIMENSION_CODES[first],
                second: t(`dimensions.${second}.name`), secondCode: DIMENSION_CODES[second],
                code: profile.hollandCode
            }),
            `${t(`dimensions.${first}.trait`)} ${t(`dimensions.${second}.complement`)}`
        ];
    }

    function psychologistFeedback(profile) {
        const [first, second] = profile.dominantDimensions(2);
        if (!first || !second) return [];
        return [
            t('monitoring.highlight', {
                first: t(`dimensions.${first}.name`), firstValue: profile[first],
                second: t(`dimensions.${second}.name`), secondValue: profile[second]
            }),
            `${t(`dimensions.${first}.trait`)} ${t(`dimensions.${second}.complement`)}`
        ];
    }

    return { studentFeedback, psychologistFeedback };
}
