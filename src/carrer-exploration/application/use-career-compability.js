import { useIamStore } from '../../iam/application/iam.store.js';
import { useVocationalAssessmentStore } from '../../assessments/application/vocational-assessments.store.js';
import { Career } from '../domain/model/career.entity.js';


export function useCareerCompatibility() {
    const iamStore = useIamStore();
    const assessmentStore = useVocationalAssessmentStore();

    async function ensureResults() {
        if (!assessmentStore.resultsLoaded && iamStore.currentUser) {
            await assessmentStore.fetchResults(iamStore.currentUser.id);
        }
    }


    function compatibilityOf(career) {
        if (!career) return 0;
        return assessmentStore.latestCompletedResult?.compatibilityFor(career.id) ?? career.baseCompatibility;
    }

    function levelOf(career) {
        return Career.compatibilityLevel(compatibilityOf(career));
    }

    return { ensureResults, compatibilityOf, levelOf };
}
