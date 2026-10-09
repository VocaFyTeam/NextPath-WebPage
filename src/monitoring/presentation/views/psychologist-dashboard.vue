<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useMonitoringStore } from '../../application/monitoring.store.js';
import { useCounselingStore } from '../../../counseling/application/counseling.store.js';
import ProgressMeter from '../components/progress-meter.vue';

const { t } = useI18n();
const iamStore = useIamStore();
const store = useMonitoringStore();
const counselingStore = useCounselingStore();
const loading = ref(true);

onMounted(async () => {
  const psychologistId = iamStore.currentUser.id;
  await Promise.all([store.fetchMonitoring(psychologistId), counselingStore.fetchPsychologistSessions(psychologistId)]);
  loading.value = false;
});

const kpis = computed(() => [
  { key: 'students', value: store.totalStudents, hint: '' },
  { key: 'tests', value: store.testsTaken, hint: '' },
  { key: 'alerts', value: store.highRiskStudents.length, hint: t('psyDashboard.kpis.alertsHint') },
  { key: 'appointments', value: counselingStore.sessionsInNextDays(7).length, hint: t('psyDashboard.kpis.appointmentsHint') }
]);

const filters = computed(() => [
  { type: 'all', label: t('psyDashboard.filters.all'), count: store.totalStudents },
  { type: 'highRisk', label: t('psyDashboard.filters.highRisk'), count: store.highRiskStudents.length },
  { type: 'lowParticipation', label: t('psyDashboard.filters.lowParticipation'), count: store.lowParticipationStudents.length },
  { type: 'inProgress', label: t('psyDashboard.filters.inProgress'), count: store.inProgressStudents.length },
  ...store.groups.map(group => ({ type: 'group', groupId: group.id, label: group.name, count: store.studentsOfGroup(group.id).length }))
]);

function isActive(filter) {
  return store.activeFilter.type === filter.type && (filter.type !== 'group' || store.activeFilter.groupId === filter.groupId);
}

/** @param {import('../../domain/model/student-overview.entity.js').StudentOverview} student */
function lastTestLabel(student) {
  const result = student.latestResult;
  if (!result) {
    const days = student.daysInactive();
    return student.flags.includes('inactivity')
        ? t('psyDashboard.notStartedInactive', { days })
        : t('psyDashboard.notStarted');
  }
  const test = store.getTest(result.testId);
  const name = (test?.shortName ?? '').replace(/^Test\s+/i, '');
  const [, month, day] = result.date.split('-').map(Number);
  return `${name} (${day}/${month}) - ${student.observation || result.summary}`;
}

const suggestion = computed(() => {
  const low = store.lowParticipationStudents.length;
  const inconsistent = store.inconsistentStudents.length;
  if (!low && !inconsistent) return t('psyDashboard.suggestionNone');
  return t('psyDashboard.suggestion', {
    low: t('psyDashboard.lowCount', low), inconsistent: t('psyDashboard.inconsistentCount', inconsistent)
  });
});
</script>

<template>
  <div class="np-page psy-dashboard">
    <div v-if="!loading && store.missingEndpoints.length" class="api-warning" role="alert">
      <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
      <div>
        <strong>{{ $t('psyDashboard.apiWarningTitle') }}</strong>
        <p>{{ $t('psyDashboard.apiWarning', { endpoints: store.missingEndpoints.map(e => '/' + e).join(', ') }) }}</p>
      </div>
    </div>

    <section class="kpis" :aria-label="$t('psyDashboard.summary')">
      <article v-for="kpi in kpis" :key="kpi.key" class="kpi">
        <h2>{{ $t(`psyDashboard.kpis.${kpi.key}`) }}</h2>
        <p>
          <strong v-if="!loading">{{ kpi.value }}</strong>
          <span v-else class="np-skeleton" style="display: inline-block; width: 30px; height: 26px"></span>
          <small v-if="kpi.hint">{{ kpi.hint }}</small>
        </p>
      </article>
    </section>

    <section class="filters" :aria-label="$t('psyDashboard.filtersTitle')">
      <h2>{{ $t('psyDashboard.filtersTitle') }}</h2>
      <div class="filters__chips" role="group">
        <button v-for="filter in filters" :key="filter.type + (filter.groupId ?? '')" type="button"
                class="chip" :class="{ 'is-active': isActive(filter) }" :aria-pressed="isActive(filter)"
                @click="store.setFilter(filter)">
          {{ filter.label }} ({{ filter.count }})
        </button>
      </div>
    </section>

    <section class="students-table">
      <table>
        <caption class="sr-only">{{ $t('psyDashboard.tableCaption') }}</caption>
        <thead>
        <tr>
          <th scope="col">{{ $t('psyDashboard.columns.student') }}</th>
          <th scope="col">{{ $t('psyDashboard.columns.progress') }}</th>
          <th scope="col" class="center">{{ $t('psyDashboard.columns.risk') }}</th>
          <th scope="col" class="center">{{ $t('psyDashboard.columns.lastTest') }}</th>
          <th scope="col" class="center">{{ $t('psyDashboard.columns.profile') }}</th>
        </tr>
        </thead>
        <tbody v-if="!loading">
        <tr v-for="student in store.filteredStudents" :key="student.studentId">
          <th scope="row">{{ student.fullName }}</th>
          <td><progress-meter :value="student.progress" :label="$t('psyDashboard.columns.progress')" /></td>
          <td class="center">
            <span class="risk" :class="`risk--${student.riskLevel}`">{{ $t(`psyDashboard.risk.${student.riskLevel}`) }}</span>
          </td>
          <td class="center last-test">{{ lastTestLabel(student) }}</td>
          <td class="center">
            <router-link :to="{ name: 'student-monitoring', query: { studentId: student.studentId } }" class="np-btn ficha-btn">
              {{ $t('psyDashboard.viewProfile') }}
            </router-link>
          </td>
        </tr>
        <tr v-if="!store.filteredStudents.length">
          <td colspan="5" class="np-empty">{{ $t('psyDashboard.noStudents') }}</td>
        </tr>
        </tbody>
        <tbody v-else>
        <tr v-for="n in 5" :key="n"><td colspan="5"><div class="np-skeleton" style="height: 22px"></div></td></tr>
        </tbody>
      </table>
    </section>

    <section class="suggestion" aria-live="polite">
      <h2>{{ $t('psyDashboard.suggestionTitle') }}</h2>
      <p>{{ suggestion }}</p>
    </section>
  </div>
</template>

<style scoped>
.psy-dashboard {
  gap: 18px;
}

.api-warning {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #f0b429;
  border-radius: 6px;
  background: #fff8e6;
  color: #7a4d00;
  font-size: 13px;
}

.api-warning i {
  margin-top: 2px;
  font-size: 18px;
}

.api-warning p {
  margin: 4px 0 0;
}

.kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
}

.kpi {
  padding: 8px 12px 10px;
  border: 1px solid var(--np-border);
  background: var(--np-surface);
  text-align: center;
}

.kpi h2 {
  margin: 0;
  color: var(--np-primary);
  font-size: 18px;
  font-weight: 600;
}

.kpi p {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 0;
}

.kpi strong {
  font-family: var(--np-font-heading);
  font-size: 26px;
  color: var(--np-ink);
}

.kpi small {
  font-size: 11px;
  color: var(--np-text);
}

.filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  padding: 8px 14px;
  background: var(--np-surface);
}

.filters h2 {
  margin: 0;
  font-family: var(--np-font-body);
  font-size: 15px;
  font-weight: 500;
}

.filters__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.chip {
  padding: 3px 8px;
  border: 1px solid var(--np-border-strong);
  background: var(--np-surface-alt);
  color: var(--np-ink);
  font-size: 11px;
  cursor: pointer;
}

.chip:hover {
  border-color: var(--np-primary);
}

.chip.is-active {
  border-color: var(--np-primary);
  background: var(--np-primary);
  color: #fff;
}

.students-table {
  overflow-x: auto;
  border: 1px solid var(--np-border);
  background: var(--np-surface);
}

.students-table table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  font-size: 12px;
}

.students-table thead th {
  padding: 14px 8px 12px;
  border-bottom: 1px solid var(--np-border);
  font-size: 11px;
  font-weight: 500;
  text-align: left;
  text-transform: uppercase;
  color: var(--np-ink);
}

.students-table tbody th,
.students-table tbody td {
  padding: 10px 8px;
  border-bottom: 2px solid #d6d6d6;
  vertical-align: middle;
}

.students-table tbody th {
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
}

.center {
  text-align: center !important;
}

.risk {
  font-weight: 700;
}

.risk--high {
  color: #b42318;
}

.risk--medium {
  color: var(--np-ink);
}

.risk--low {
  color: var(--np-primary);
}

.last-test {
  font-size: 11.5px;
}

.ficha-btn {
  min-width: 90px;
  min-height: 30px;
  border-radius: 0;
  font-family: var(--np-font-body);
  font-size: 12px;
  font-weight: 500;
}

.suggestion {
  padding: 6px 10px 10px;
  border: 2px solid var(--np-primary);
  background: var(--np-surface);
}

.suggestion h2 {
  margin: 0 0 2px;
  color: var(--np-primary);
  font-size: 19px;
  font-weight: 600;
}

.suggestion p {
  margin: 0;
  color: var(--np-primary);
  font-size: 12px;
}

@media (max-width: 1000px) {
  .kpis {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .kpis {
    grid-template-columns: 1fr;
  }
}
</style>
