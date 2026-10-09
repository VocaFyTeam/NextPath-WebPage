<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useCounselingStore } from '../../application/counseling.store.js';

const { t } = useI18n();
const toast = useToast();
const iamStore = useIamStore();
const store = useCounselingStore();
const loading = ref(true);

onMounted(async () => {
  await store.fetchStudentSessions(iamStore.currentUser.id);
  loading.value = false;
});

async function copyLink(link) {
  try {
    await navigator.clipboard.writeText(link);
    toast.add({ severity: 'success', summary: t('sessions.linkCopied'), life: 2000 });
  } catch {
    toast.add({ severity: 'warn', summary: t('sessions.copyFailed'), detail: link, life: 4000 });
  }
}
</script>

<template>
  <div class="np-page sessions">
    <h1 class="np-page-title np-page-title--normal sessions__title">{{ $t('sessions.title') }}</h1>

    <div class="sessions__grid">
      <section class="np-panel sessions__list-panel" aria-labelledby="scheduled-title">
        <h2 id="scheduled-title" class="sessions__subtitle">{{ $t('sessions.scheduled') }}</h2>

        <ul v-if="!loading && store.upcomingStudentSessions.length" class="sessions__list">
          <li v-for="session in store.upcomingStudentSessions" :key="session.id"
              class="session-item" :class="{ 'is-active': store.selectedSession?.id === session.id }">
            <div>
              <strong>{{ $t('sessions.dateTime', { value: session.dateTimeLabel }) }}</strong>
              <span>{{ $t('sessions.psychologist', { name: session.psychologistName }) }}</span>
            </div>
            <button type="button" class="np-btn np-btn--sm session-item__btn"
                    :aria-pressed="store.selectedSession?.id === session.id" @click="store.selectSession(session.id)">
              {{ $t('sessions.viewMore') }}
            </button>
          </li>
        </ul>
        <p v-else-if="!loading" class="np-empty"><i class="pi pi-calendar"></i>{{ $t('sessions.empty') }}</p>
        <div v-else class="sessions__list"><div v-for="n in 3" :key="n" class="np-skeleton" style="height: 56px"></div></div>
      </section>

      <section class="np-panel sessions__detail" aria-live="polite">
        <template v-if="store.selectedSession">
          <h2 class="sessions__detail-title">{{ $t('sessions.details') }}</h2>
          <p class="sessions__detail-meta">
            <strong>{{ $t('sessions.dateTime', { value: store.selectedSession.dateTimeLabel }) }}</strong>
            <span>{{ $t('sessions.psychologist', { name: store.selectedSession.psychologistName }) }}</span>
          </p>

          <div class="sessions__notes">
            <h3>{{ $t('sessions.notes') }}</h3>
            <p>{{ store.selectedSession.notes }}</p>
          </div>

          <div class="sessions__link">
            <span>{{ $t('sessions.meetLink') }}</span>
            <div class="sessions__link-pill">
              <a :href="store.selectedSession.meetLink" target="_blank" rel="noopener noreferrer">{{ store.selectedSession.meetLink }}</a>
              <button type="button" :aria-label="$t('sessions.copyLink')" v-tooltip.top="$t('sessions.copyLink')"
                      @click="copyLink(store.selectedSession.meetLink)">
                <i class="pi pi-clone" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          <div class="sessions__join">
            <a :href="store.selectedSession.meetLink" target="_blank" rel="noopener noreferrer" class="np-btn sessions__join-btn">
              {{ $t('sessions.join') }}
            </a>
          </div>
        </template>
        <p v-else-if="!loading" class="np-empty"><i class="pi pi-info-circle"></i>{{ $t('sessions.selectOne') }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.sessions {
  gap: 16px;
}

.sessions__title {
  font-size: 28px;
  font-weight: 600;
}

.sessions__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.sessions__list-panel,
.sessions__detail {
  min-height: calc(100vh - var(--np-topbar-height) - 150px);
}

.sessions__list-panel {
  padding: 26px 34px;
}

.sessions__subtitle {
  margin: 0 0 26px;
  color: var(--np-primary);
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

.sessions__list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.session-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 8px 18px;
  border: 1px solid var(--np-border);
  background: var(--np-surface-alt);
  font-size: 11.5px;
  transition: border-color 0.15s ease;
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

.session-item__btn {
  border-radius: 0;
  font-family: var(--np-font-body);
  font-weight: 500;
}

.sessions__detail {
  display: flex;
  flex-direction: column;
  padding: 24px 22px;
  border: 1.5px solid var(--np-primary);
}

.sessions__detail-title {
  margin: 0 0 18px;
  color: var(--np-primary);
  font-size: 26px;
  font-weight: 600;
}

.sessions__detail-meta {
  display: flex;
  flex-direction: column;
  margin: 0 0 16px;
  font-size: 12px;
}

.sessions__notes {
  padding: 10px 10px 16px;
  border: 1px solid var(--np-border-strong);
  background: var(--np-surface-alt);
}

.sessions__notes h3 {
  margin: 0 0 8px;
  color: var(--np-primary);
  font-size: 18px;
  font-weight: 600;
}

.sessions__notes p {
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
}

.sessions__link {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 34px;
  color: var(--np-primary);
  font-family: var(--np-font-heading);
  font-size: 17px;
}

.sessions__link-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 220px;
  padding: 4px 6px 4px 10px;
  border: 1.5px solid var(--np-primary);
  border-radius: 8px;
}

.sessions__link-pill a {
  overflow: hidden;
  color: var(--np-ink);
  font-family: var(--np-font-body);
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sessions__link-pill button {
  padding: 2px 4px;
  border: 0;
  background: transparent;
  color: var(--np-ink);
  cursor: pointer;
}

.sessions__link-pill button:hover {
  color: var(--np-primary);
}

.sessions__join {
  display: flex;
  justify-content: center;
  margin-top: 46px;
}

.sessions__join-btn {
  border-radius: 0;
}

@media (max-width: 900px) {
  .sessions__grid {
    grid-template-columns: 1fr;
  }

  .sessions__list-panel,
  .sessions__detail {
    min-height: 0;
    padding: 18px;
  }
}
</style>
