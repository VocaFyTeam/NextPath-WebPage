<script setup>
import { computed, onMounted, ref } from 'vue';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useTasksStore } from '../../application/tasks.store.js';
import { useVocationalAssessmentStore } from '../../../assessments/application/vocational-assessments.store.js';

const iamStore = useIamStore();
const tasksStore = useTasksStore();
const assessmentStore = useVocationalAssessmentStore();
const loading = ref(true);

const history = computed(() => [...assessmentStore.sortedResults].reverse());

onMounted(async () => {
  const studentId = iamStore.currentUser.id;
  await Promise.all([tasksStore.fetchTasks(studentId), assessmentStore.fetchTests(), assessmentStore.fetchResults(studentId)]);
  loading.value = false;
});

function reportRoute(result) {
  return result.isCompleted
      ? { name: 'vocational-results', params: { resultId: result.id } }
      : { name: 'vocational-test', params: { testId: result.testId } };
}
</script>

<template>
  <div class="np-page tasks">
    <h1 class="np-page-title">{{ $t('tasks.title') }}</h1>

    <div class="tasks__grid">
      <section class="np-panel tasks__panel" aria-labelledby="history-title">
        <h2 id="history-title" class="np-section-title tasks__panel-title">{{ $t('tasks.history') }}</h2>

        <ul v-if="!loading && history.length" class="tasks__list">
          <li v-for="result in history" :key="result.id" class="history-item">
            <div class="history-item__info">
              <strong>{{ assessmentStore.getTestById(result.testId)?.shortName }}</strong>
              <span>{{ $t('tasks.date', { date: result.formattedDate }) }}</span>
              <span class="history-item__version">• {{ $t('tasks.version', { version: result.version }) }}</span>
            </div>
            <div class="history-item__side">
              <router-link :to="reportRoute(result)" class="np-btn np-btn--sm history-item__btn">
                {{ $t(result.isCompleted ? 'tasks.viewReport' : 'tests.continue') }}
              </router-link>
              <span class="history-item__status">
                {{ $t('tasks.status') }}
                <b :class="result.isCompleted ? 'np-status--completed' : 'np-status--pending'">
                  {{ $t(result.isCompleted ? 'tasks.statusCompleted' : 'tasks.statusPending') }}
                </b>
              </span>
            </div>
          </li>
        </ul>
        <p v-else-if="!loading" class="np-empty"><i class="pi pi-chart-bar"></i>{{ $t('tasks.noHistory') }}</p>
        <div v-else class="tasks__list"><div v-for="n in 3" :key="n" class="np-skeleton" style="height: 62px"></div></div>
      </section>

      <section class="np-panel tasks__panel" aria-labelledby="plan-title">
        <h2 id="plan-title" class="tasks__panel-title tasks__panel-title--plan">{{ $t('tasks.plan') }}</h2>

        <ul v-if="!loading && tasksStore.tasks.length" class="tasks__list">
          <li v-for="task in tasksStore.tasks" :key="task.id" class="plan-item">
            <div>
              <strong>{{ task.title }}</strong>
              <span v-if="task.dueDate">{{ $t('tasks.date', { date: task.formattedDueDate }) }}</span>
            </div>
            <button type="button" class="plan-item__status"
                    :class="task.isCompleted ? 'np-status--completed' : 'np-status--pending'"
                    v-tooltip.left="$t(task.isCompleted ? 'tasks.markPending' : 'tasks.markCompleted')"
                    :aria-label="`${task.title}: ${$t(task.isCompleted ? 'tasks.markPending' : 'tasks.markCompleted')}`"
                    @click="tasksStore.toggleTask(task.id)">
              {{ $t(task.isCompleted ? 'tasks.completed' : 'tasks.pending') }}
            </button>
          </li>
        </ul>
        <p v-else-if="!loading" class="np-empty"><i class="pi pi-list-check"></i>{{ $t('tasks.noTasks') }}</p>
        <div v-else class="tasks__list"><div v-for="n in 3" :key="n" class="np-skeleton" style="height: 44px"></div></div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.tasks {
  gap: 24px;
}

.tasks__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.tasks__panel {
  min-height: calc(100vh - var(--np-topbar-height) - 160px);
  padding: 22px 34px;
}

.tasks__panel-title {
  margin-bottom: 26px;
  font-size: 18px;
  text-align: center;
}

.tasks__panel-title--plan {
  font-family: var(--np-font-heading);
  font-weight: 600;
  color: var(--np-primary);
}

.tasks__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.history-item,
.plan-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 10px;
  border: 1px solid var(--np-border);
  background: var(--np-surface-alt);
  font-size: 11.5px;
}

.history-item__info,
.plan-item div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.history-item strong,
.plan-item strong {
  font-size: 12px;
  color: var(--np-ink);
}

.history-item__version {
  padding-left: 6px;
}

.history-item__side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
}

.history-item__btn {
  border-radius: 0;
  font-family: var(--np-font-body);
  font-weight: 500;
}

.history-item__status {
  font-size: 11.5px;
  color: var(--np-primary);
  font-weight: 600;
}

.plan-item {
  align-items: center;
  padding: 12px 10px;
}

.plan-item__status {
  padding: 4px 6px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  font-size: 12px;
  cursor: pointer;
}

.plan-item__status:hover {
  background: var(--np-primary-soft);
}

@media (max-width: 900px) {
  .tasks__grid {
    grid-template-columns: 1fr;
  }

  .tasks__panel {
    min-height: 0;
    padding: 18px;
  }
}
</style>
