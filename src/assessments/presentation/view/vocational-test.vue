<script setup>
import { computed, onMounted, ref, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useVocationalAssessmentStore } from '../../application/vocational-assessments.store.js';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const iamStore = useIamStore();
const store = useVocationalAssessmentStore();

const loading = ref(true);
const questionHeading = ref(null);

onMounted(async () => {
  if (!store.resultsLoaded) await store.fetchResults(iamStore.currentUser.id);
  await store.startTest(route.params.testId);
  loading.value = false;
});

// Move focus to the question when it changes (keyboard / screen-reader users).
watch(() => store.currentIndex, async () => {
  await nextTick();
  questionHeading.value?.focus();
});

const answerText = computed({
  get: () => store.currentAnswer ?? '',
  set: value => store.setAnswer(value)
});

async function goNext() {
  if (!store.canContinue) {
    toast.add({ severity: 'warn', summary: t('test.answerRequired'), life: 2500 });
    return;
  }
  if (!store.isLastQuestion) {
    store.nextQuestion();
    return;
  }
  const result = await store.submitTest(iamStore.currentUser.id);
  if (result) {
    router.push({ name: 'vocational-results', params: { resultId: result.id } });
  } else {
    toast.add({ severity: 'error', summary: t('common.error'), detail: t('test.submitError'), life: 4000 });
  }
}
</script>

<template>
  <div class="np-page">
    <section class="np-panel test" v-if="!loading && store.currentTest">
      <header class="test__header">
        <h1 class="test__title">{{ store.currentTest.headline }}</h1>
        <p class="test__instructions">{{ store.currentTest.instructions }}</p>
        <div class="test__progress" role="progressbar" :aria-valuenow="store.progress" aria-valuemin="0" aria-valuemax="100"
             :aria-label="$t('test.progress')">
          <div class="test__progress-fill" :style="{ width: `${store.progress}%` }"></div>
        </div>
        <p class="test__progress-label">{{ $t('test.progress') }} · {{ store.currentIndex + 1 }}/{{ store.questions.length }}</p>
      </header>

      <div v-if="store.currentQuestion" class="question">
        <h2 ref="questionHeading" tabindex="-1" class="question__number">
          {{ $t('test.question', { number: store.currentIndex + 1 }) }}
        </h2>
        <p class="question__text" id="question-text">{{ store.currentQuestion.text }}</p>

        <textarea
            v-if="store.currentQuestion.isOpen"
            v-model="answerText"
            class="question__answer"
            rows="7"
            aria-labelledby="question-text"
            :placeholder="store.currentQuestion.placeholder || $t('test.placeholder')"
        ></textarea>

        <div v-else class="question__options" role="radiogroup" aria-labelledby="question-text">
          <label v-for="option in store.currentQuestion.options" :key="option.id" class="option"
                 :class="{ 'is-selected': store.currentAnswer === option.id }">
            <input type="radio" :name="`question-${store.currentQuestion.id}`" :value="option.id"
                   :checked="store.currentAnswer === option.id" @change="store.setAnswer(option.id)" />
            <span>{{ option.text }}</span>
          </label>
        </div>
      </div>

      <footer class="test__actions">
        <button type="button" class="np-btn test__prev" :disabled="store.isFirstQuestion" @click="store.previousQuestion()">
          <i class="pi pi-angle-left" aria-hidden="true"></i> {{ $t('test.previous') }}
        </button>
        <button type="button" class="np-btn test__next" :disabled="store.submitting" @click="goNext">
          <template v-if="store.submitting"><i class="pi pi-spin pi-spinner" aria-hidden="true"></i> {{ $t('test.analyzing') }}</template>
          <template v-else-if="store.isLastQuestion">{{ $t('test.finish') }} <i class="pi pi-check" aria-hidden="true"></i></template>
          <template v-else>{{ $t('test.next') }} <i class="pi pi-angle-right" aria-hidden="true"></i></template>
        </button>
      </footer>
    </section>

    <section v-else-if="loading" class="np-panel test">
      <div class="np-skeleton" style="height: 28px; width: 60%"></div>
      <div class="np-skeleton" style="height: 14px; width: 80%; margin-top: 12px"></div>
      <div class="np-skeleton" style="height: 220px; margin-top: 30px"></div>
    </section>

    <section v-else class="np-panel np-empty">
      <i class="pi pi-exclamation-circle"></i>{{ $t('test.notFound') }}
      <p><router-link class="np-link" :to="{ name: 'vocational-test-list' }">{{ $t('test.backToTests') }}</router-link></p>
    </section>
  </div>
</template>

<style scoped>
.test {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - var(--np-topbar-height) - 70px);
  padding: 22px 24px;
}

.test__title {
  margin: 0;
  color: var(--np-primary);
  font-size: 24px;
  font-weight: 700;
}

.test__instructions {
  margin: 6px 0 12px;
  font-size: 12px;
  color: var(--np-text);
}

.test__progress {
  width: 32%;
  min-width: 200px;
  height: 3px;
  background: #d9d9d9;
}

.test__progress-fill {
  height: 100%;
  background: var(--np-primary);
  transition: width 0.3s ease;
}

.test__progress-label {
  margin: 4px 0 0;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--np-primary);
  text-transform: uppercase;
}

.question {
  flex: 1;
  margin-top: 18px;
}

.question__number {
  margin: 0 0 8px;
  color: var(--np-primary);
  font-size: 17px;
  font-weight: 600;
  outline: none;
}

.question__text {
  margin: 0 0 22px;
  padding: 10px 12px;
  border: 1.5px solid var(--np-primary-muted);
  color: var(--np-ink);
  font-weight: 700;
  font-size: 14px;
  line-height: 1.4;
}

.question__answer {
  width: 100%;
  min-height: 170px;
  padding: 12px;
  border: 1px solid var(--np-border-strong);
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
  color: var(--np-ink);
}

.question__answer:focus {
  outline: 2px solid var(--np-primary-muted);
  border-color: var(--np-primary);
}

.question__options {
  display: grid;
  gap: 10px;
}

.option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--np-border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.option:hover {
  border-color: var(--np-primary-muted);
}

.option.is-selected {
  border-color: var(--np-primary);
  background: var(--np-primary-soft);
}

.option input {
  accent-color: var(--np-primary);
  width: 16px;
  height: 16px;
}

.test__actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 26px;
}

.test__prev,
.test__next {
  min-width: 130px;
  border-radius: 0;
  font-family: var(--np-font-body);
  font-weight: 500;
}

.test__prev {
  background: var(--np-primary);
}

.test__next {
  background: var(--np-primary-dark);
}

.test__next:hover {
  background: var(--np-primary-dark-hover);
}
</style>
