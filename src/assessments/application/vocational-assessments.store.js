import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { AssessmentsApi } from '../insfrastructure/assessments-api.js';
import { VocationalTestAssembler } from '../insfrastructure/vocational-test.assembler.js';
import { TestQuestionAssembler } from '../insfrastructure/test-question.assembler.js';
import { TestResultAssembler } from '../insfrastructure/test-result.assembler.js';
import { TestResult } from '../domain/model/test-result.entity.js';
import { AffinityAnalyzer } from '../domain/model/affinity-analyzer.js';

const assessmentsApi = new AssessmentsApi();

function today() {
    const now = new Date();
    const pad = value => String(value).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export const useVocationalAssessmentStore = defineStore('vocationalAssessment', () => {

    const tests = ref([]);
    const results = ref([]);
    const testsLoaded = ref(false);
    const resultsLoaded = ref(false);
    const errors = ref([]);

    const currentTest = ref(null);
    const questions = ref([]);
    const currentIndex = ref(0);
    const answers = ref({});
    const submitting = ref(false);

    const currentQuestion = computed(() => questions.value[currentIndex.value] ?? null);
    const isFirstQuestion = computed(() => currentIndex.value === 0);
    const isLastQuestion = computed(() => currentIndex.value === questions.value.length - 1);
    const progress = computed(() =>
        currentTest.value ? currentTest.value.getProgress(currentIndex.value, questions.value.length) : 0);
    const currentAnswer = computed(() => answers.value[currentQuestion.value?.id]);
    const canContinue = computed(() => currentQuestion.value?.isAnswered(currentAnswer.value) ?? false);

    const sortedResults = computed(() => [...results.value].sort((a, b) => b.date.localeCompare(a.date)));
    const completedResults = computed(() => sortedResults.value.filter(result => result.isCompleted));
    const latestCompletedResult = computed(() => completedResults.value[0] ?? null);
    const completedTestsCount = computed(() => new Set(completedResults.value.map(r => r.testId)).size);

    function resultForTest(testId) {
        return sortedResults.value.find(result => result.testId === String(testId)) ?? null;
    }

    function getTestById(testId) {
        return tests.value.find(test => test.id === String(testId)) ?? null;
    }

    const suggestedTests = computed(() =>
        tests.value.filter(test => !completedResults.value.some(result => result.testId === test.id)));

    async function fetchTests() {
        try {
            const response = await assessmentsApi.getTests();
            tests.value = VocationalTestAssembler.toEntitiesFromResponse(response);
            testsLoaded.value = true;
        } catch (error) {
            errors.value.push(error);
        }
    }

    async function fetchResults(studentId) {
        try {
            const response = await assessmentsApi.getResultsByStudentId(studentId);
            results.value = TestResultAssembler.toEntitiesFromResponse(response);
            resultsLoaded.value = true;
        } catch (error) {
            errors.value.push(error);
        }
    }


    async function fetchResultById(resultId) {
        const cached = results.value.find(result => result.id === String(resultId));
        if (cached) return cached;
        try {
            const response = await assessmentsApi.getResultById(resultId);
            const result = TestResultAssembler.toEntityFromResource(response.data);
            results.value.push(result);
            return result;
        } catch (error) {
            errors.value.push(error);
            return null;
        }
    }


    async function startTest(testId) {
        currentIndex.value = 0;
        answers.value = {};
        questions.value = [];
        try {
            if (!testsLoaded.value) await fetchTests();
            currentTest.value = getTestById(testId)
                ?? VocationalTestAssembler.toEntityFromResource((await assessmentsApi.getTestById(testId)).data);
            const response = await assessmentsApi.getQuestionsByTestId(testId);
            questions.value = TestQuestionAssembler.toEntitiesFromResponse(response);
            const pending = resultForTest(testId);
            if (pending && !pending.isCompleted) answers.value = { ...pending.answers };
        } catch (error) {
            errors.value.push(error);
        }
    }

    function setAnswer(value) {
        if (!currentQuestion.value) return;
        answers.value = { ...answers.value, [currentQuestion.value.id]: value };
    }

    function nextQuestion() {
        if (!isLastQuestion.value) currentIndex.value++;
    }

    function previousQuestion() {
        if (!isFirstQuestion.value) currentIndex.value--;
    }

    async function submitTest(studentId) {
        if (!currentTest.value) return null;
        submitting.value = true;
        try {
            const profile = AffinityAnalyzer.analyze(questions.value, answers.value);
            const careers = (await assessmentsApi.getCareerProfiles()).data ?? [];
            const pending = resultForTest(currentTest.value.id);

            const result = new TestResult({
                id: pending && !pending.isCompleted ? pending.id : null,
                studentId,
                testId: currentTest.value.id,
                date: today(),
                version: currentTest.value.version,
                status: 'completed',
                summary: `Perfil ${profile.hollandCode}`,
                scores: profile.toJSON(),
                careerMatches: AffinityAnalyzer.matchCareers(profile, careers),
                answers: answers.value
            });

            const resource = TestResultAssembler.toResourceFromEntity(result);
            const response = result.id
                ? await assessmentsApi.updateResult(resource)
                : await assessmentsApi.createResult(resource);
            const saved = TestResultAssembler.toEntityFromResource(response.data);

            const index = results.value.findIndex(r => r.id === saved.id);
            if (index !== -1) results.value[index] = saved; else results.value.push(saved);
            return saved;
        } catch (error) {
            errors.value.push(error);
            return null;
        } finally {
            submitting.value = false;
        }
    }

    return {
        tests, results, testsLoaded, resultsLoaded, errors,
        currentTest, questions, currentIndex, answers, submitting,
        currentQuestion, currentAnswer, isFirstQuestion, isLastQuestion, progress, canContinue,
        sortedResults, completedResults, latestCompletedResult, completedTestsCount, suggestedTests,
        resultForTest, getTestById,
        fetchTests, fetchResults, fetchResultById, startTest, setAnswer, nextQuestion, previousQuestion, submitTest
    };
});

export default useVocationalAssessmentStore;
