<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useVocationalAssessmentStore } from '../../application/vocational-assessments.store.js';
import { useCareerExplorationStore } from '../../../carrer-exploration/application/career-exploration.store.js';
import { DIMENSION_CODES } from '../../domain/model/affinity-profile.js';
import AffinityRadarChart from '../../presentation/components/affinity-radar-chart.vue';

const route = useRoute();
const { t } = useI18n();
const iamStore = useIamStore();
const store = useVocationalAssessmentStore();
const careerStore = useCareerExplorationStore();

const loading = ref(true);
const result = ref(null);

onMounted(async () => {
  await Promise.all([store.fetchTests(), careerStore.careersLoaded ? null : careerStore.fetchCareers()]);
  result.value = await store.fetchResultById(route.params.resultId);
  loading.value = false;
});

const test = computed(() => (result.value ? store.getTestById(result.value.testId) : null));
const dominant = computed(() => result.value?.profile.dominantDimensions(2) ?? []);

const recommendedCareers = computed(() =>
    (result.value?.topCareerIds(3) ?? []).map(id => careerStore.getCareerById(id)).filter(Boolean));

const interpretation = computed(() => {
  if (dominant.value.length < 2) return [];
  const [first, second] = dominant.value;
  return [
    t('results.interpretationIntro', {
      first: t(`dimensions.${first}.name`), firstCode: DIMENSION_CODES[first],
      second: t(`dimensions.${second}.name`), secondCode: DIMENSION_CODES[second],
      code: result.value.profile.hollandCode
    }),
    `${t(`dimensions.${first}.trait`)} ${t(`dimensions.${second}.complement`)}`
  ];
});

function downloadReport() {
  window.print();
}
</script>

<template>
  <div class="np-page results">
    <template v-if="!loading && result">
      <header>
        <h1 class="np-page-title np-page-title--normal results__title">
          {{ $t('results.congrats', { name: iamStore.currentUser.firstName }) }}
        </h1>
        <p class="np-page-subtitle">
          {{ test?.isOpenEnded ? $t('results.subtitleAi') : $t('results.subtitle', { test: test?.title }) }}
          <span class="results__meta">· {{ result.formattedDate }} · v{{ result.version }}</span>
        </p>
      </header>

      <div class="results__grid">
        <section class="np-panel results__panel">
          <h2 class="np-section-title">{{ $t('results.affinityChart') }}</h2>
          <affinity-radar-chart :profile="result.profile" />
        </section>

        <section class="np-panel results__panel results__panel--feedback">
          <h2 class="np-section-title">{{ $t('results.feedbackTitle') }}</h2>
          <p v-for="(paragraph, i) in interpretation" :key="i" class="results__paragraph">{{ paragraph }}</p>

          <h3 class="results__subtitle">{{ $t('results.recommendedCareers') }}</h3>
          <ul class="results__careers">
            <li v-for="career in recommendedCareers" :key="career.id">
              <router-link :to="{ name: 'career-detail', params: { id: career.id } }">
                {{ career.name }}
                <span>({{ result.compatibilityFor(career.id) }}%)</span>
              </router-link>
            </li>
          </ul>
        </section>
      </div>

      <footer class="results__actions np-no-print">
        <router-link :to="{ name: 'career-list' }" class="np-btn np-btn--lg results__btn results__btn--dark">
          {{ $t('results.exploreCareers') }}
        </router-link>
        <button type="button" class="np-btn np-btn--lg results__btn" @click="downloadReport">
          {{ $t('results.downloadReport') }}
        </button>
      </footer>
    </template>

    <template v-else-if="loading">
      <div class="np-skeleton" style="height: 40px; width: 50%"></div>
      <div class="results__grid">
        <div class="np-skeleton" style="height: 380px"></div>
        <div class="np-skeleton" style="height: 380px"></div>
      </div>
    </template>

    <section v-else class="np-panel np-empty">
      <i class="pi pi-exclamation-circle"></i>{{ $t('results.notFound') }}
    </section>
  </div>
</template>

<style scoped>
.results {
  gap: 16px;
}

.results__title {
  font-size: 30px;
}

.results__meta {
  color: var(--np-muted);
}

.results__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.results__panel {
  min-height: 400px;
  padding: 18px 20px;
}

.results__panel--feedback {
  border-left: 4px double var(--np-border-strong);
}

.results__paragraph {
  margin: 16px 0 0;
  font-size: 13px;
  line-height: 1.55;
}

.results__subtitle {
  margin: 26px 0 8px;
  font-family: var(--np-font-heading);
  font-size: 14px;
  font-weight: 700;
  color: var(--np-ink);
  text-transform: uppercase;
}

.results__careers {
  margin: 0;
  padding-left: 18px;
}

.results__careers li {
  margin-bottom: 4px;
  color: var(--np-primary);
}

.results__careers a {
  color: var(--np-primary);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
}

.results__careers a:hover {
  text-decoration: underline;
}

.results__careers span {
  color: var(--np-muted);
  font-weight: 500;
  font-size: 12px;
}

.results__actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 20px;
}

.results__btn {
  min-width: 200px;
  border-radius: 0;
  font-family: var(--np-font-body);
  font-weight: 500;
}

.results__btn--dark {
  background: var(--np-primary-dark);
}

.results__btn--dark:hover {
  background: var(--np-primary-dark-hover);
}

@media (max-width: 900px) {
  .results__grid {
    grid-template-columns: 1fr;
  }
}

@media print {
  .results__grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
