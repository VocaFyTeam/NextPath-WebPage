<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useMonitoringStore } from '../../application/monitoring.store.js';
import { useMessagingStore } from '../../../counseling/application/messaging.store.js';
import { useResultInterpretation } from '../../../assessments/application/use-result-interpretation.js';
import AffinityRadarChart from '../../../assessments/presentation/components/affinity-radar-chart.vue';

const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const iamStore = useIamStore();
const store = useMonitoringStore();
const messagingStore = useMessagingStore();
const { psychologistFeedback } = useResultInterpretation();

const loading = ref(true);
const search = ref('');
const selectedId = ref(null);
const selectedResultId = ref(null);

const observationVisible = ref(false);
const observation = ref('');
const sending = ref(false);

onMounted(async () => {
  if (!store.loaded) await store.fetchMonitoring(iamStore.currentUser.id);
  const requested = typeof route.query.studentId === 'string' ? route.query.studentId : null;
  selectStudent(store.getStudent(requested)?.studentId ?? store.students[0]?.studentId ?? null);
  loading.value = false;
});

const normalize = text => (text ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const visibleStudents = computed(() =>
    store.students.filter(student => normalize(student.fullName).includes(normalize(search.value))));

const student = computed(() => store.getStudent(selectedId.value));
const result = computed(() =>
    student.value?.completedResults.find(r => r.id === selectedResultId.value) ?? student.value?.latestResult ?? null);
const test = computed(() => (result.value ? store.getTest(result.value.testId) : null));
const recommendedCareers = computed(() =>
    (result.value?.topCareerIds(3) ?? []).map(id => ({ id, name: store.careerName(id), value: result.value.compatibilityFor(id) })));
const feedback = computed(() => (result.value ? psychologistFeedback(result.value.profile) : []));

function selectStudent(studentId) {
  selectedId.value = studentId;
  selectedResultId.value = null;
}

/** @param {import('../../domain/model/student-overview.entity.js').StudentOverview} item */
function listSubtitle(item) {
  const attempt = item.lastAttempt;
  if (!attempt) return t('monitoring.pending');
  const name = store.getTest(attempt.testId)?.shortName ?? '';
  return attempt.isCompleted ? name : `${name} · ${t('monitoring.inProgress')}`;
}

function openObservation() {
  observation.value = '';
  observationVisible.value = true;
}

async function sendObservation() {
  if (!observation.value.trim()) return;
  sending.value = true;
  const psychologist = iamStore.currentUser;
  const ok = await messagingStore.sendDirect({
    studentId: student.value.studentId,
    studentName: student.value.fullName,
    psychologistId: psychologist.id,
    psychologistName: psychologist.fullName,
    senderRole: 'psychologist',
    text: `${t('monitoring.observationPrefix')} ${observation.value.trim()}`
  });
  sending.value = false;
  if (ok) {
    observationVisible.value = false;
    toast.add({ severity: 'success', summary: t('monitoring.observationSent', { name: student.value.firstName }), life: 3000 });
  } else {
    toast.add({ severity: 'error', summary: t('common.error'), life: 3000 });
  }
}
</script>

<template>
  <div class="monitoring">
    <aside class="np-panel monitoring__list" :aria-label="$t('monitoring.students')">
      <h1 class="monitoring__title">{{ $t('monitoring.students') }}</h1>
      <label class="monitoring__search">
        <span class="sr-only">{{ $t('monitoring.searchPlaceholder') }}</span>
        <i class="pi pi-search" aria-hidden="true"></i>
        <input v-model="search" type="search" :placeholder="$t('monitoring.searchPlaceholder')" />
      </label>

      <ul v-if="!loading">
        <li v-for="item in visibleStudents" :key="item.studentId">
          <button type="button" class="student-item" :class="{ 'is-active': item.studentId === selectedId }"
                  :aria-current="item.studentId === selectedId ? 'true' : undefined" @click="selectStudent(item.studentId)">
            <strong>{{ item.fullName }}</strong>
            <span class="student-item__test">{{ listSubtitle(item) }}</span>
            <span class="student-item__date">{{ $t('monitoring.date', { date: item.lastAttempt?.formattedDate ?? '—' }) }}</span>
          </button>
        </li>
        <li v-if="!visibleStudents.length" class="np-empty">{{ $t('monitoring.noMatches') }}</li>
      </ul>
      <div v-else class="monitoring__skeletons"><div v-for="n in 5" :key="n" class="np-skeleton" style="height: 60px"></div></div>
    </aside>

    <section class="np-panel profile" aria-live="polite">
      <template v-if="student && result">
        <header class="profile__header">
          <h2>{{ $t('monitoring.profileTitle', { name: student.fullName }) }}</h2>
          <div class="profile__meta">
            <span>{{ $t('monitoring.evaluationDate', { date: result.formattedDate, test: test?.shortName, version: result.version }) }}</span>
            <label v-if="student.completedResults.length > 1" class="profile__history">
              <span class="sr-only">{{ $t('monitoring.history') }}</span>
              <select :value="result.id" @change="selectedResultId = $event.target.value">
                <option v-for="item in student.completedResults" :key="item.id" :value="item.id">
                  {{ store.getTest(item.testId)?.shortName }} · {{ item.formattedDate }}
                </option>
              </select>
            </label>
          </div>
        </header>

        <div class="profile__body">
          <affinity-radar-chart :profile="result.profile" />
          <div class="profile__careers">
            <h3>{{ $t('results.recommendedCareers') }}</h3>
            <ul>
              <li v-for="career in recommendedCareers" :key="career.id">{{ career.name }} <span>({{ career.value }}%)</span></li>
            </ul>
          </div>
        </div>

        <div class="profile__feedback">
          <h3>{{ $t('results.feedbackTitle') }}</h3>
          <p v-for="(paragraph, i) in feedback" :key="i">{{ paragraph }}</p>
        </div>

        <footer class="profile__actions">
          <button type="button" class="np-btn profile__send" @click="openObservation">{{ $t('monitoring.sendObservation') }}</button>
        </footer>
      </template>

      <div v-else-if="student" class="np-empty profile__empty">
        <i class="pi pi-hourglass"></i>
        <strong>{{ student.fullName }}</strong>
        <p>{{ $t('monitoring.noResults') }}</p>
        <button type="button" class="np-btn" @click="openObservation">{{ $t('monitoring.sendReminder') }}</button>
      </div>

      <div v-else-if="loading" class="np-skeleton" style="height: 420px"></div>
    </section>

    <pv-dialog v-model:visible="observationVisible" modal :header="$t('monitoring.sendObservation')"
               :style="{ width: '480px' }" :breakpoints="{ '640px': '94vw' }">
      <label for="observation-text" class="dialog__label">{{ $t('monitoring.observationFor', { name: student?.fullName }) }}</label>
      <pv-textarea id="observation-text" v-model="observation" rows="5" auto-resize class="w-full"
                   :placeholder="$t('monitoring.observationPlaceholder')" />
      <template #footer>
        <button type="button" class="np-btn np-btn--ghost" @click="observationVisible = false">{{ $t('common.cancel') }}</button>
        <button type="button" class="np-btn" :disabled="sending || !observation.trim()" @click="sendObservation">
          <i v-if="sending" class="pi pi-spin pi-spinner" aria-hidden="true"></i> {{ $t('monitoring.send') }}
        </button>
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>
.monitoring {
  display: grid;
  grid-template-columns: minmax(220px, 0.75fr) minmax(0, 1.8fr);
  gap: 14px;
  min-height: calc(100vh - var(--np-topbar-height) - 70px);
}

.monitoring__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px 12px;
}

.monitoring__title {
  margin: 0;
  color: var(--np-primary);
  font-size: 28px;
  font-weight: 600;
}

.monitoring__search {
  position: relative;
  display: block;
}

.monitoring__search i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: var(--np-muted);
}

.monitoring__search input {
  width: 100%;
  height: 32px;
  padding: 0 10px 0 30px;
  border: 1px solid var(--np-border-strong);
  background: var(--np-surface-alt);
  font-size: 12px;
}

.monitoring__search input:focus {
  outline: 2px solid var(--np-primary-muted);
}

.monitoring__list ul {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.monitoring__skeletons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.student-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--np-border-strong);
  background: var(--np-surface);
  text-align: left;
  cursor: pointer;
}

.student-item strong {
  font-family: var(--np-font-heading);
  font-size: 15px;
  color: var(--np-ink);
}

.student-item__test {
  font-size: 11px;
  font-weight: 600;
}

.student-item__date {
  font-size: 11px;
  color: var(--np-muted);
}

.student-item:hover {
  border-color: var(--np-primary);
}

.student-item.is-active {
  border-color: var(--np-primary);
  box-shadow: inset 3px 0 0 var(--np-primary);
  background: var(--np-primary-soft);
}

.profile {
  display: flex;
  flex-direction: column;
  padding: 14px 18px 16px;
}

.profile__header h2 {
  margin: 0 0 8px;
  color: var(--np-primary);
  font-size: 19px;
  font-weight: 600;
}

.profile__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 6px;
  border-bottom: 2px solid #bdbdbd;
  font-size: 11.5px;
}

.profile__history select {
  height: 26px;
  border: 1px solid var(--np-border);
  font-size: 11px;
}

.profile__body {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  padding: 4px 0;
}

.profile__body :deep(.radar svg) {
  max-width: 320px;
}

.profile__careers h3 {
  margin: 0 0 8px;
  font-family: var(--np-font-heading);
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
}

.profile__careers ul {
  margin: 0;
  padding-left: 18px;
  color: var(--np-primary);
}

.profile__careers li {
  font-family: var(--np-font-heading);
  font-size: 14px;
  font-weight: 600;
}

.profile__careers span {
  color: var(--np-muted);
  font-size: 12px;
  font-weight: 500;
}

.profile__feedback {
  margin: 4px 0 0;
  padding: 10px 20px 16px;
  border: 1px solid var(--np-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

.profile__feedback h3 {
  margin: 0 0 4px;
  color: var(--np-primary);
  font-size: 17px;
  font-weight: 600;
  text-transform: uppercase;
}

.profile__feedback p {
  margin: 0 0 8px;
  font-size: 12px;
  line-height: 1.45;
}

.profile__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 18px;
}

.profile__send {
  border-radius: 0;
  background: #0d6e66;
  font-family: var(--np-font-body);
  font-size: 12.5px;
  font-weight: 500;
}

.profile__empty {
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.dialog__label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
}

@media (max-width: 1000px) {
  .monitoring {
    grid-template-columns: 1fr;
  }

  .profile__body {
    grid-template-columns: 1fr;
  }
}
</style>
