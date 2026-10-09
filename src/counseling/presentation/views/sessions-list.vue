<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useCounselingStore } from '../../application/counseling.store.js';
import { useMessagingStore } from '../../application/messaging.store.js';
import { useMonitoringStore } from '../../../monitoring/application/monitoring.store.js';
import { CounselingSession } from '../../domain/model/counseling-session.entity.js';

/** Psychologist agenda: "Programación de Sesiones de Orientación" (mock-up 15). */
const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const iamStore = useIamStore();
const store = useCounselingStore();
const messagingStore = useMessagingStore();
const monitoringStore = useMonitoringStore();

const loading = ref(true);
/** 'detail' shows the selected session, 'form' schedules or edits one. */
const mode = ref('detail');
const selectedId = ref(null);
const errorKey = ref('');

const emptyForm = () => ({
  id: null, type: 'INDIVIDUAL', studentId: '', groupId: '', topic: '', notes: '',
  date: '', time: '', meetLink: CounselingSession.generateMeetLink()
});
const form = reactive(emptyForm());

onMounted(async () => {
  const psychologistId = iamStore.currentUser.id;
  await Promise.all([
    store.fetchPsychologistSessions(psychologistId),
    monitoringStore.loaded ? null : monitoringStore.fetchMonitoring(psychologistId)
  ]);
  selectedId.value = store.scheduledPsychologistSessions[0]?.id ?? null;
  if (route.query.new) {
    startNew(route.query.new === 'group' ? 'GROUP' : 'INDIVIDUAL', typeof route.query.groupId === 'string' ? route.query.groupId : '');
  }
  loading.value = false;
});

const sessions = computed(() => store.scheduledPsychologistSessions);
const selected = computed(() => sessions.value.find(session => session.id === selectedId.value) ?? null);

function select(id) {
  selectedId.value = id;
  mode.value = 'detail';
}

function startNew(type = 'INDIVIDUAL', groupId = '') {
  Object.assign(form, emptyForm(), { type, groupId });
  errorKey.value = '';
  mode.value = 'form';
}

function startEdit(session) {
  Object.assign(form, {
    id: session.id, type: session.type, studentId: session.studentId ?? '', groupId: session.groupId ?? '',
    topic: session.isGroup ? session.title.split(' - ').slice(1).join(' - ') : '', notes: session.notes,
    date: session.dateInputValue, time: session.timeInputValue, meetLink: session.meetLink || CounselingSession.generateMeetLink()
  });
  errorKey.value = '';
  mode.value = 'form';
}

/** @returns {?CounselingSession} Entity built from the form, or null when invalid. */
function buildSession() {
  const psychologist = iamStore.currentUser;
  const existing = sessions.value.find(s => s.id === form.id);
  if (!form.date || !form.time) return null;

  if (form.type === 'INDIVIDUAL') {
    const student = monitoringStore.getStudent(form.studentId);
    if (!student) return null;
    return new CounselingSession({
      ...existing, id: form.id, type: 'INDIVIDUAL', title: `${t('agenda.individualTitle')} - ${student.fullName}`,
      target: student.fullName, studentId: student.studentId, groupId: null, studentIds: [student.studentId], attendeesCount: 1,
      psychologistId: psychologist.id, psychologistName: psychologist.fullName,
      date: CounselingSession.formatDate(form.date), time: CounselingSession.formatTime(form.time),
      notes: form.notes.trim(), meetLink: form.meetLink, status: 'SCHEDULED'
    });
  }
  const group = monitoringStore.getGroup(form.groupId);
  if (!group) return null;
  const members = monitoringStore.studentsOfGroup(group.id).map(student => student.studentId);
  const number = existing ? null : sessions.value.filter(s => s.isGroup).length + 1;
  const title = existing
      ? `${existing.title.split(' - ')[0]} - ${form.topic.trim() || group.name}`
      : `${t('agenda.groupTitle', { number })} - ${form.topic.trim() || group.name}`;
  return new CounselingSession({
    ...existing, id: form.id, type: 'GROUP', title, target: group.name, studentId: null, groupId: group.id,
    studentIds: members, attendeesCount: members.length,
    psychologistId: psychologist.id, psychologistName: psychologist.fullName,
    date: CounselingSession.formatDate(form.date), time: CounselingSession.formatTime(form.time),
    notes: form.notes.trim(), meetLink: form.meetLink, status: 'SCHEDULED'
  });
}

async function save() {
  errorKey.value = '';
  const session = buildSession();
  if (!session) {
    errorKey.value = 'agenda.errors.required';
    return;
  }
  const isNew = !session.id;
  const saved = await store.saveSession(session);
  if (!saved) {
    errorKey.value = 'agenda.errors.server';
    return;
  }
  await notifyStudents(saved, isNew);
  select(saved.id);
  toast.add({ severity: 'success', summary: t(isNew ? 'agenda.scheduled' : 'agenda.updated'), detail: t('agenda.notified'), life: 3500 });
}

/** Sends a message to every student of the session with the date and link. */
async function notifyStudents(session, isNew) {
  const psychologist = iamStore.currentUser;
  const text = t(isNew ? 'agenda.notification' : 'agenda.notificationUpdate',
      { title: session.title, date: session.dateTimeLabel, link: session.meetLink });
  // One after another: each write must finish before the next one (safer with json-server --watch).
  for (const studentId of session.studentIds) {
    const student = monitoringStore.getStudent(studentId);
    await messagingStore.sendDirect({
      studentId, studentName: student?.fullName ?? '', psychologistId: psychologist.id, psychologistName: psychologist.fullName,
      senderRole: 'psychologist', text
    });
  }
}

async function cancelSelected() {
  if (!selected.value || !window.confirm(t('agenda.confirmCancel'))) return;
  await store.cancelSession(selected.value.id);
  selectedId.value = sessions.value[0]?.id ?? null;
  toast.add({ severity: 'info', summary: t('agenda.cancelled'), life: 2500 });
}

async function copyLink(link) {
  try {
    await navigator.clipboard.writeText(link);
    toast.add({ severity: 'success', summary: t('sessions.linkCopied'), life: 2000 });
  } catch {
    toast.add({ severity: 'warn', summary: t('sessions.copyFailed'), detail: link, life: 4000 });
  }
}

/** @param {CounselingSession} session */
function subtitle(session) {
  return session.isGroup ? t('agenda.students', { n: session.attendeesCount }) : t('agenda.oneOnOne');
}
</script>

<template>
  <div class="np-page agenda">
    <h1 class="np-page-title np-page-title--normal agenda__title">{{ $t('agenda.title') }}</h1>

    <div class="agenda__grid">
      <section class="np-panel agenda__list" aria-labelledby="agenda-list-title">
        <header class="agenda__list-header">
          <h2 id="agenda-list-title">{{ $t('sessions.scheduled') }}</h2>
          <button type="button" class="np-btn np-btn--sm agenda__add" @click="startNew()">{{ $t('agenda.add') }}</button>
        </header>

        <ul v-if="!loading && sessions.length">
          <li v-for="session in sessions" :key="session.id" class="session-item"
              :class="{ 'is-active': mode === 'detail' && session.id === selectedId }">
            <div>
              <strong>{{ session.title }}</strong>
              <span class="session-item__date">{{ $t('sessions.dateTime', { value: session.dateTimeLabel }) }}</span>
              <span>{{ subtitle(session) }}</span>
            </div>
            <button type="button" class="np-btn np-btn--sm session-item__btn" @click="select(session.id)">{{ $t('sessions.viewMore') }}</button>
          </li>
        </ul>
        <p v-else-if="!loading" class="np-empty"><i class="pi pi-calendar"></i>{{ $t('sessions.empty') }}</p>
        <div v-else class="agenda__skeletons"><div v-for="n in 3" :key="n" class="np-skeleton" style="height: 62px"></div></div>
      </section>

      <!-- FORM: schedule / edit -->
      <section v-if="mode === 'form'" class="np-panel agenda__detail">
        <h2 class="agenda__detail-title">{{ $t('sessions.details') }}</h2>
        <form class="agenda__form" novalidate @submit.prevent="save">
          <fieldset class="agenda__field">
            <legend>{{ $t('agenda.type') }}</legend>
            <div class="agenda__radios">
              <label><input v-model="form.type" type="radio" value="INDIVIDUAL" /> {{ $t('agenda.individual') }}</label>
              <label><input v-model="form.type" type="radio" value="GROUP" /> {{ $t('agenda.group') }}</label>
            </div>
          </fieldset>

          <div class="agenda__field">
            <label :for="form.type === 'GROUP' ? 'agenda-group' : 'agenda-student'">{{ $t('agenda.target') }}</label>
            <select v-if="form.type === 'INDIVIDUAL'" id="agenda-student" v-model="form.studentId" class="agenda__input">
              <option value="" disabled>{{ $t('agenda.chooseStudent') }}</option>
              <option v-for="student in monitoringStore.students" :key="student.studentId" :value="student.studentId">{{ student.fullName }}</option>
            </select>
            <select v-else id="agenda-group" v-model="form.groupId" class="agenda__input">
              <option value="" disabled>{{ $t('agenda.chooseGroup') }}</option>
              <option v-for="group in monitoringStore.groups" :key="group.id" :value="group.id">
                {{ group.name }} ({{ $t('agenda.students', { n: monitoringStore.studentsOfGroup(group.id).length }) }})
              </option>
            </select>
          </div>

          <div v-if="form.type === 'GROUP'" class="agenda__field">
            <label for="agenda-topic">{{ $t('agenda.topic') }}</label>
            <input id="agenda-topic" v-model="form.topic" class="agenda__input" type="text" :placeholder="$t('agenda.topicPlaceholder')" />
          </div>

          <div class="agenda__notes">
            <label for="agenda-notes">{{ $t('sessions.notes') }}</label>
            <textarea id="agenda-notes" v-model="form.notes" rows="3" :placeholder="$t('agenda.notesPlaceholder')"></textarea>
          </div>

          <div class="agenda__field">
            <span class="agenda__label">{{ $t('agenda.dateTime') }}</span>
            <div class="agenda__datetime">
              <label class="sr-only" for="agenda-date">{{ $t('agenda.date') }}</label>
              <input id="agenda-date" v-model="form.date" class="agenda__input" type="date" />
              <label class="sr-only" for="agenda-time">{{ $t('agenda.time') }}</label>
              <input id="agenda-time" v-model="form.time" class="agenda__input" type="time" />
            </div>
          </div>

          <div class="agenda__link">
            <span>{{ $t('sessions.meetLink') }}</span>
            <div class="agenda__link-pill">
              <span>{{ form.meetLink }}</span>
              <button type="button" :aria-label="$t('sessions.copyLink')" v-tooltip.top="$t('sessions.copyLink')" @click="copyLink(form.meetLink)">
                <i class="pi pi-clone" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <p v-if="errorKey" class="agenda__error" role="alert">{{ $t(errorKey) }}</p>

          <div class="agenda__actions">
            <button v-if="selected" type="button" class="np-btn np-btn--ghost" @click="mode = 'detail'">{{ $t('common.cancel') }}</button>
            <button type="submit" class="np-btn agenda__submit" :disabled="store.saving">
              <i v-if="store.saving" class="pi pi-spin pi-spinner" aria-hidden="true"></i>
              {{ $t(form.id ? 'agenda.saveChanges' : 'agenda.scheduleAndNotify') }}
            </button>
          </div>
        </form>
      </section>

      <!-- DETAIL: selected session -->
      <section v-else class="np-panel agenda__detail" aria-live="polite">
        <template v-if="selected">
          <h2 class="agenda__detail-title">{{ $t('sessions.details') }}</h2>
          <p class="agenda__meta">
            <strong>{{ $t('sessions.dateTime', { value: selected.dateTimeLabel }) }}</strong>
            <span>{{ $t('sessions.psychologist', { name: selected.psychologistName }) }}</span>
          </p>
          <p class="agenda__meta">
            <strong>{{ $t('agenda.target') }}</strong>
            <span>{{ selected.target }} · {{ subtitle(selected) }}</span>
          </p>

          <div class="agenda__notes agenda__notes--readonly">
            <h3>{{ $t('sessions.notes') }}</h3>
            <p>{{ selected.notes || $t('agenda.noNotes') }}</p>
          </div>

          <div class="agenda__link">
            <span>{{ $t('sessions.meetLink') }}</span>
            <div class="agenda__link-pill">
              <a :href="selected.meetLink" target="_blank" rel="noopener noreferrer">{{ selected.meetLink }}</a>
              <button type="button" :aria-label="$t('sessions.copyLink')" v-tooltip.top="$t('sessions.copyLink')" @click="copyLink(selected.meetLink)">
                <i class="pi pi-clone" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <div class="agenda__actions agenda__actions--center">
            <a :href="selected.meetLink" target="_blank" rel="noopener noreferrer" class="np-btn agenda__submit">{{ $t('sessions.join') }}</a>
          </div>
          <div class="agenda__secondary">
            <button type="button" class="agenda__text-btn" @click="startEdit(selected)"><i class="pi pi-pencil" aria-hidden="true"></i> {{ $t('agenda.edit') }}</button>
            <button type="button" class="agenda__text-btn agenda__text-btn--danger" @click="cancelSelected"><i class="pi pi-times" aria-hidden="true"></i> {{ $t('agenda.cancelSession') }}</button>
          </div>
        </template>
        <div v-else-if="!loading" class="np-empty">
          <i class="pi pi-calendar-plus"></i>{{ $t('agenda.emptyDetail') }}
          <p><button type="button" class="np-btn np-btn--sm" @click="startNew()">{{ $t('agenda.add') }}</button></p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.agenda {
  gap: 16px;
}

.agenda__title {
  font-size: 26px;
  font-weight: 600;
}

.agenda__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.agenda__list,
.agenda__detail {
  min-height: calc(100vh - var(--np-topbar-height) - 150px);
}

.agenda__list {
  padding: 24px 28px;
}

.agenda__list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

.agenda__list-header h2 {
  margin: 0;
  color: var(--np-primary);
  font-size: 18px;
  font-weight: 600;
}

.agenda__add {
  border-radius: 0;
  background: var(--np-primary-dark);
  font-family: var(--np-font-body);
  font-weight: 500;
}

.agenda__add:hover {
  background: var(--np-primary-dark-hover);
}

.agenda__list ul,
.agenda__skeletons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.session-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 8px 10px;
  border: 1px solid var(--np-border);
  background: var(--np-surface-alt);
  font-size: 11.5px;
}

.session-item.is-active {
  border-color: var(--np-primary);
  box-shadow: inset 3px 0 0 var(--np-primary);
}

.session-item div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.session-item strong {
  font-size: 12px;
  color: var(--np-ink);
}

.session-item__date {
  color: var(--np-primary);
  font-weight: 700;
}

.session-item__btn {
  flex-shrink: 0;
  border-radius: 0;
  font-family: var(--np-font-body);
  font-weight: 500;
}

.agenda__detail {
  display: flex;
  flex-direction: column;
  padding: 22px 22px;
  border: 1.5px solid var(--np-primary);
}

.agenda__detail-title {
  margin: 0 0 14px;
  color: var(--np-primary);
  font-size: 26px;
  font-weight: 600;
}

.agenda__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.agenda__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  border: 0;
}

.agenda__field legend,
.agenda__field > label,
.agenda__label {
  padding: 0;
  font-size: 12px;
  font-weight: 700;
  color: var(--np-ink);
}

.agenda__radios {
  display: flex;
  gap: 60px;
  margin-top: 4px;
  font-size: 12px;
}

.agenda__radios label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.agenda__radios input {
  width: 16px;
  height: 16px;
  accent-color: var(--np-primary);
}

.agenda__input {
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--np-border);
  background: var(--np-surface-alt);
  font-size: 12px;
  color: var(--np-ink);
}

.agenda__input:focus,
.agenda__notes textarea:focus {
  outline: 2px solid var(--np-primary-muted);
}

.agenda__datetime {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
}

.agenda__notes {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px 12px;
  border: 1px solid var(--np-border-strong);
  background: var(--np-surface-alt);
}

.agenda__notes label,
.agenda__notes h3 {
  margin: 0;
  color: var(--np-primary);
  font-family: var(--np-font-heading);
  font-size: 17px;
  font-weight: 600;
}

.agenda__notes textarea {
  min-height: 60px;
  padding: 6px;
  border: 0;
  background: transparent;
  font-size: 12px;
  resize: vertical;
}

.agenda__notes p {
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
}

.agenda__notes--readonly {
  margin-top: 10px;
}

.agenda__meta {
  display: flex;
  flex-direction: column;
  margin: 0 0 10px;
  font-size: 12px;
}

.agenda__link {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 16px;
  color: var(--np-primary);
  font-family: var(--np-font-heading);
  font-size: 16px;
}

.agenda__link-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 230px;
  padding: 4px 6px 4px 10px;
  border: 1.5px solid var(--np-primary);
  border-radius: 8px;
}

.agenda__link-pill > span,
.agenda__link-pill a {
  overflow: hidden;
  color: var(--np-ink);
  font-family: var(--np-font-body);
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.agenda__link-pill button {
  padding: 2px 4px;
  border: 0;
  background: transparent;
  color: var(--np-ink);
  cursor: pointer;
}

.agenda__error {
  margin: 0;
  padding: 8px 10px;
  border-radius: 6px;
  background: #fff1f0;
  color: #b42318;
  font-size: 12px;
}

.agenda__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
}

.agenda__actions--center {
  margin-top: 34px;
}

.agenda__submit {
  border-radius: 0;
}

.agenda__secondary {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: auto;
  padding-top: 18px;
}

.agenda__text-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  border: 0;
  background: transparent;
  color: var(--np-primary);
  font-size: 12px;
  cursor: pointer;
}

.agenda__text-btn:hover {
  text-decoration: underline;
}

.agenda__text-btn--danger {
  color: #b42318;
}

@media (max-width: 900px) {
  .agenda__grid {
    grid-template-columns: 1fr;
  }

  .agenda__list,
  .agenda__detail {
    min-height: 0;
  }

  .agenda__datetime {
    gap: 12px;
  }
}
</style>
