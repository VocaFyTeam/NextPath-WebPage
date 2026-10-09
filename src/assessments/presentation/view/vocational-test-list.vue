<script setup>
import { computed, onMounted, ref } from 'vue';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useVocationalAssessmentStore } from '../../application/vocational-assessments.store.js';

const iamStore = useIamStore();
const store = useVocationalAssessmentStore();
const loading = ref(true);

onMounted(async () => {
  await Promise.all([store.fetchTests(), store.fetchResults(iamStore.currentUser.id)]);
  loading.value = false;
});

const featuredTest = computed(() => store.tests.find(test => test.featured) ?? null);
const otherTests = computed(() => store.tests.filter(test => !test.featured));

/** @param {import('../../domain/model/vocational-test.entity.js').VocationalTest} test */
function statusOf(test) {
  const result = store.resultForTest(test.id);
  if (!result) return null;
  return result.isCompleted
      ? { key: 'tests.completedOn', date: result.formattedDate, resultId: result.id, completed: true }
      : { key: 'tests.inProgress', date: result.formattedDate, completed: false };
}
</script>

<template>
  <div class="np-page tests">
    <header>
      <h1 class="np-page-title">{{ $t('tests.title') }}</h1>
      <p class="np-page-subtitle">{{ $t('tests.subtitle') }}</p>
    </header>

    <template v-if="!loading">
      <article v-if="featuredTest" class="test-card test-card--featured">
        <div class="test-card__body">
          <h2>{{ featuredTest.title }}</h2>
          <p>{{ featuredTest.description }}</p>
          <p v-if="statusOf(featuredTest)" class="test-card__status" :class="{ 'is-done': statusOf(featuredTest).completed }">
            <i :class="statusOf(featuredTest).completed ? 'pi pi-check-circle' : 'pi pi-clock'" aria-hidden="true"></i>
            {{ $t(statusOf(featuredTest).key, { date: statusOf(featuredTest).date }) }}
            <router-link v-if="statusOf(featuredTest).completed" class="np-link"
                         :to="{ name: 'vocational-results', params: { resultId: statusOf(featuredTest).resultId } }">
              {{ $t('tests.viewResult') }}
            </router-link>
          </p>
        </div>
        <router-link :to="{ name: 'vocational-test', params: { testId: featuredTest.id } }" class="np-btn np-btn--dark np-btn--lg">
          {{ $t(statusOf(featuredTest)?.completed === false ? 'tests.continue' : 'tests.start') }}
        </router-link>
      </article>

      <section class="tests__grid">
        <article v-for="test in otherTests" :key="test.id" class="test-card">
          <div class="test-card__body">
            <h2>{{ test.title }}</h2>
            <p>{{ test.description }}</p>
            <p v-if="statusOf(test)" class="test-card__status" :class="{ 'is-done': statusOf(test).completed }">
              <i :class="statusOf(test).completed ? 'pi pi-check-circle' : 'pi pi-clock'" aria-hidden="true"></i>
              {{ $t(statusOf(test).key, { date: statusOf(test).date }) }}
              <router-link v-if="statusOf(test).completed" class="np-link"
                           :to="{ name: 'vocational-results', params: { resultId: statusOf(test).resultId } }">
                {{ $t('tests.viewResult') }}
              </router-link>
            </p>
          </div>
          <router-link :to="{ name: 'vocational-test', params: { testId: test.id } }" class="np-btn np-btn--dark np-btn--lg test-card__cta">
            {{ $t(statusOf(test)?.completed === false ? 'tests.continue' : 'tests.start') }}
          </router-link>
        </article>
      </section>
    </template>

    <template v-else>
      <div class="np-skeleton" style="height: 120px"></div>
      <div class="tests__grid">
        <div v-for="n in 4" :key="n" class="np-skeleton" style="height: 150px"></div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.tests {
  gap: 20px;
  padding-top: 8px;
}

.tests__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px 22px;
}

.test-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  min-height: 150px;
  padding: 14px 16px 16px;
  border-radius: var(--np-radius-lg);
  background: var(--np-surface);
}

.test-card--featured {
  flex-direction: row;
  align-items: center;
  min-height: 0;
  padding: 18px 26px 22px 18px;
  border: 2px solid var(--np-primary);
}

.test-card__body h2 {
  margin: 0 0 8px;
  color: var(--np-primary);
  font-size: 20px;
  font-weight: 600;
}

.test-card__body p {
  margin: 0;
  max-width: 560px;
  font-size: 12px;
  line-height: 1.45;
  color: var(--np-text);
}

.test-card__status {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px !important;
  font-size: 12px !important;
  font-weight: 600;
  color: var(--np-muted) !important;
}

.test-card__status.is-done {
  color: var(--np-primary) !important;
}

.test-card__cta {
  align-self: flex-end;
}

.test-card .np-btn--lg {
  min-width: 150px;
  flex-shrink: 0;
  font-family: var(--np-font-body);
  font-weight: 500;
}

@media (max-width: 900px) {
  .tests__grid {
    grid-template-columns: 1fr;
  }

  .test-card--featured {
    flex-direction: column;
    align-items: flex-start;
  }

  .test-card--featured .np-btn {
    align-self: flex-end;
  }
}
</style>
