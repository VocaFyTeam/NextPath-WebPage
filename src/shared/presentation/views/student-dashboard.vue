<script setup>
import { computed, onMounted, ref } from 'vue';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useVocationalAssessmentStore } from '../../../assessments/application/vocational-assessments.store.js';
import { useTasksStore } from '../../../tasks/application/tasks.store.js';
import { useCareerExplorationStore } from '../../../carrer-exploration/application/career-exploration.store.js';
import { useCounselingStore } from '../../../counseling/application/counseling.store.js';

import { VocationalProgress } from '../../domain/model/vocational-progress.js';

const iamStore = useIamStore();
const assessmentStore = useVocationalAssessmentStore();
const tasksStore = useTasksStore();
const careerStore = useCareerExplorationStore();
const counselingStore = useCounselingStore();

const loading = ref(true);
const student = computed(() => iamStore.currentUser);

onMounted(async () => {
  const studentId = student.value.id;
  await Promise.all([
    assessmentStore.fetchTests(),
    assessmentStore.fetchResults(studentId),
    tasksStore.fetchTasks(studentId),
    careerStore.fetchFavorites(studentId),
    counselingStore.fetchStudentSessions(studentId)
  ]);
  loading.value = false;
});

const quickLinks = [
  { title: 'dashboard.cards.tests', action: 'dashboard.cards.goTests', to: { name: 'vocational-test-list' } },
  { title: 'dashboard.cards.careers', action: 'dashboard.cards.goCareers', to: { name: 'career-list' } },
  { title: 'dashboard.cards.sessions', action: 'dashboard.cards.goSessions', to: { name: 'student-sessions' } },
  { title: 'dashboard.cards.messages', action: 'dashboard.cards.goMessages', to: { name: 'student-messages' } }
];

const progress = computed(() => new VocationalProgress({
  completedTests: assessmentStore.completedTestsCount,
  totalTests: assessmentStore.tests.length,
  completedTasks: tasksStore.completedTasks.length,
  totalTasks: tasksStore.tasks.length,
  favorites: careerStore.favorites.length
}).percentage);

/** Lines of "Mi progreso vocacional general": taken tests, next suggested test and favorites. */
const progressItems = computed(() => {
  const items = [];
  const tests = assessmentStore.tests;

  tests.forEach((test, index) => {
    const result = assessmentStore.resultForTest(test.id);
    if (!result) return;
    items.push({
      key: `result-${result.id}`,
      done: result.isCompleted,
      title: `${index + 1}`,
      test,
      status: result.isCompleted ? 'completed' : 'inProgress',
      date: result.formattedDate,
      detail: result.isCompleted ? result.summary : '',
      to: result.isCompleted
          ? { name: 'vocational-results', params: { resultId: result.id } }
          : { name: 'vocational-test', params: { testId: test.id } }
    });
  });

  const suggested = tests.find(test => !assessmentStore.resultForTest(test.id));
  if (suggested) {
    items.push({
      key: `suggested-${suggested.id}`, done: false, title: `${tests.indexOf(suggested) + 1}`, test: suggested,
      status: 'suggested', date: '', detail: '', to: { name: 'vocational-test', params: { testId: suggested.id } }
    });
  }
  return items;
});

const pendingTasks = computed(() => tasksStore.pendingTasks);
const scheduledSessions = computed(() => counselingStore.upcomingStudentSessions.length);
</script>

<template>
  <div class="np-page dashboard">
    <section class="dashboard__hero">
      <h1>{{ $t('dashboard.greeting', { name: student?.firstName }) }}</h1>
      <p v-if="!loading">
        {{ $t('dashboard.welcome') }}
        {{ $t('dashboard.summary', { tasks: $t('dashboard.tasksCount', pendingTasks.length), sessions: $t('dashboard.sessionsCount', scheduledSessions) }) }}
      </p>
      <p v-else>{{ $t('dashboard.welcome') }}</p>
    </section>

    <section class="dashboard__cards" :aria-label="$t('dashboard.shortcuts')">
      <article v-for="link in quickLinks" :key="link.title" class="np-card dashboard__card">
        <h2>{{ $t(link.title) }}</h2>
        <router-link :to="link.to" class="np-btn dashboard__card-btn">{{ $t(link.action) }}</router-link>
      </article>
    </section>

    <section class="dashboard__bottom">
      <article class="np-card dashboard__progress">
        <h2 class="np-section-title dashboard__heading">{{ $t('dashboard.progressTitle') }}</h2>

        <div class="progress-bar" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar__fill" :style="{ width: `${progress}%` }">
            <span>{{ $t('dashboard.completed', { value: progress }) }}</span>
          </div>
        </div>

        <ul v-if="!loading" class="checklist">
          <li v-for="item in progressItems" :key="item.key">
            <router-link :to="item.to" class="checklist__item">
              <i :class="item.done ? 'pi pi-check-square' : 'pi pi-stop'" aria-hidden="true"></i>
              <span>
                <strong>
                  {{ $t('dashboard.testLine', { number: item.title, name: item.test.shortName.replace(/^Test\s+/i, '') }) }} -
                  {{ $t(`dashboard.status.${item.status}`) }} {{ item.date }}
                </strong>
                <small v-if="item.detail">{{ item.detail }}</small>
              </span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'favorite-careers' }" class="checklist__item">
              <i :class="careerStore.favorites.length ? 'pi pi-check-square' : 'pi pi-stop'" aria-hidden="true"></i>
              <span>
                <strong>{{ $t('dashboard.favoritesLine') }}</strong>
                <small>{{ $t('dashboard.favoritesDetail', careerStore.favorites.length) }}</small>
              </span>
            </router-link>
          </li>
        </ul>
        <div v-else class="checklist">
          <div v-for="n in 4" :key="n" class="np-skeleton" style="height: 26px"></div>
        </div>
      </article>

      <article class="np-card dashboard__tasks">
        <h2 class="np-section-title dashboard__heading">{{ $t('dashboard.nextTasks') }}</h2>
        <ul v-if="pendingTasks.length" class="checklist">
          <li v-for="task in pendingTasks" :key="task.id">
            <router-link :to="{ name: 'task-board' }" class="checklist__item">
              <i class="pi pi-stop" aria-hidden="true"></i>
              <span>
                <strong>{{ task.title }}</strong>
                <small v-if="task.dueDate">{{ $t('tasks.date', { date: task.formattedDueDate }) }}</small>
              </span>
            </router-link>
          </li>
        </ul>
        <p v-else-if="!loading" class="np-empty"><i class="pi pi-check-circle"></i>{{ $t('dashboard.noTasks') }}</p>
      </article>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  gap: 18px;
}

.dashboard__hero {
  margin: -26px -34px 0;
  padding: 20px 34px 22px;
  background: var(--np-primary);
  color: #fff;
}

.dashboard__hero h1 {
  margin: 0 0 8px;
  color: #fff;
  font-size: 40px;
  font-weight: 700;
}

.dashboard__hero p {
  margin: 0;
  font-family: var(--np-font-heading);
  font-size: 15px;
  font-weight: 500;
}

.dashboard__cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 30px;
}

.dashboard__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-height: 132px;
  padding: 18px 16px 22px;
  text-align: center;
}

.dashboard__card h2 {
  margin: 0;
  color: var(--np-primary);
  font-size: 19px;
  font-weight: 600;
  line-height: 1.2;
}

.dashboard__card-btn {
  min-width: 140px;
  background: #0d6e66;
  border-radius: 0;
  font-family: var(--np-font-body);
  font-weight: 500;
}

.dashboard__bottom {
  display: grid;
  grid-template-columns: minmax(0, 1.75fr) minmax(0, 1fr);
  gap: 24px;
}

.dashboard__progress,
.dashboard__tasks {
  padding: 16px 16px 22px;
  min-height: 300px;
}

.dashboard__heading {
  margin-bottom: 18px;
  color: #0d6e66;
  font-size: 17px;
}

.progress-bar {
  width: 75%;
  height: 12px;
  margin-bottom: 18px;
  background: #d9d9d9;
}

.progress-bar__fill {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-width: 90px;
  background: #0b5a4b;
  transition: width 0.6s ease;
}

.progress-bar__fill span {
  color: #fff;
  font-size: 8.5px;
  font-weight: 600;
  white-space: nowrap;
}

.checklist {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.checklist__item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: var(--np-ink);
  text-decoration: none;
}

.checklist__item i {
  margin-top: 2px;
  font-size: 14px;
  color: var(--np-primary);
}

.checklist__item strong {
  display: block;
  font-family: var(--np-font-heading);
  font-size: 13.5px;
  font-weight: 600;
}

.checklist__item small {
  display: block;
  margin-top: 2px;
  font-size: 11px;
  color: var(--np-muted);
}

.checklist__item:hover strong {
  color: var(--np-primary);
}

@media (max-width: 1150px) {
  .dashboard__cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }
}

@media (max-width: 900px) {
  .dashboard__hero {
    margin: -18px -16px 0;
    padding: 18px 16px;
  }

  .dashboard__hero h1 {
    font-size: 30px;
  }

  .dashboard__bottom {
    grid-template-columns: 1fr;
  }

  .progress-bar {
    width: 100%;
  }
}

@media (max-width: 520px) {
  .dashboard__cards {
    grid-template-columns: 1fr;
  }
}
</style>
