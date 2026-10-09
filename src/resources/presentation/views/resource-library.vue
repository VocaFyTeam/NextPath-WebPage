<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useResourcesStore } from '../../application/resources.store.js';
import { useMonitoringStore } from '../../../monitoring/application/monitoring.store.js';
import { useMessagingStore } from '../../../counseling/application/messaging.store.js';

const { t } = useI18n();
const toast = useToast();
const iamStore = useIamStore();
const store = useResourcesStore();
const monitoringStore = useMonitoringStore();
const messagingStore = useMessagingStore();
const loading = ref(true);

const shareVisible = ref(false);
const shareResource = ref(null);
const shareStudentId = ref('');
const shareNote = ref('');
const sharing = ref(false);

onMounted(async () => {
  const psychologistId = iamStore.currentUser.id;
  await Promise.all([
    store.fetchResources(psychologistId),
    monitoringStore.loaded ? null : monitoringStore.fetchMonitoring(psychologistId)
  ]);
  loading.value = false;
});

function openShare(resource) {
  shareResource.value = resource;
  shareStudentId.value = '';
  shareNote.value = '';
  shareVisible.value = true;
}

async function share() {
  const student = monitoringStore.getStudent(shareStudentId.value);
  if (!student) return;
  sharing.value = true;
  const psychologist = iamStore.currentUser;
  const ok = await messagingStore.sendDirect({
    studentId: student.studentId, studentName: student.fullName,
    psychologistId: psychologist.id, psychologistName: psychologist.fullName,
    senderRole: 'psychologist',
    text: shareNote.value.trim() || t('resources.defaultNote'),
    attachment: shareResource.value.toAttachment()
  });
  sharing.value = false;
  if (ok) {
    shareVisible.value = false;
    toast.add({ severity: 'success', summary: t('resources.shared', { name: student.firstName }), life: 3000 });
  } else {
    toast.add({ severity: 'error', summary: t('common.error'), life: 3000 });
  }
}
</script>

<template>
  <div class="np-page library">
    <h1 class="np-page-title library__title">{{ $t('resources.title') }}</h1>

    <label class="library__search">
      <span class="sr-only">{{ $t('resources.searchPlaceholder') }}</span>
      <input v-model="store.query" type="search" :placeholder="$t('resources.searchPlaceholder')" />
    </label>

    <section v-if="!loading && store.filteredResources.length" class="library__grid">
      <article v-for="resource in store.filteredResources" :key="resource.id" class="resource">
        <div class="resource__info">
          <h2>{{ resource.title }}</h2>
          <p class="resource__updated">{{ $t('resources.updated') }}<br />{{ resource.formattedUpdatedAt }}</p>
          <div class="resource__actions">
            <a :href="resource.fileUrl" download target="_blank" rel="noopener" class="np-btn np-btn--sm resource__btn"
               :aria-label="$t('resources.downloadNamed', { title: resource.title })">{{ $t('resources.download') }}</a>
            <button type="button" class="np-btn np-btn--sm resource__btn" @click="openShare(resource)"
                    :aria-label="$t('resources.shareNamed', { title: resource.title })">{{ $t('resources.share') }}</button>
          </div>
        </div>
        <img :src="resource.coverUrl" :alt="$t('resources.cover', { title: resource.title })" class="resource__cover" />
      </article>
    </section>

    <section v-else-if="loading" class="library__grid">
      <div v-for="n in 3" :key="n" class="np-skeleton" style="height: 170px"></div>
    </section>

    <section v-else class="np-card np-empty"><i class="pi pi-book"></i>{{ $t('resources.noResults') }}</section>

    <pv-dialog v-model:visible="shareVisible" modal :header="$t('resources.shareTitle', { title: shareResource?.title })"
               :style="{ width: '460px' }" :breakpoints="{ '640px': '94vw' }">
      <div class="share">
        <label for="share-student">{{ $t('resources.shareWith') }}</label>
        <select id="share-student" v-model="shareStudentId">
          <option value="" disabled>{{ $t('agenda.chooseStudent') }}</option>
          <option v-for="student in monitoringStore.students" :key="student.studentId" :value="student.studentId">{{ student.fullName }}</option>
        </select>
        <label for="share-note">{{ $t('resources.note') }}</label>
        <pv-textarea id="share-note" v-model="shareNote" rows="3" auto-resize class="w-full" :placeholder="$t('resources.defaultNote')" />
      </div>
      <template #footer>
        <button type="button" class="np-btn np-btn--ghost" @click="shareVisible = false">{{ $t('common.cancel') }}</button>
        <button type="button" class="np-btn" :disabled="sharing || !shareStudentId" @click="share">
          <i v-if="sharing" class="pi pi-spin pi-spinner" aria-hidden="true"></i> {{ $t('resources.send') }}
        </button>
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>
.library {
  gap: 14px;
  padding-top: 14px;
}

.library__title {
  padding-left: 14px;
  font-size: 28px;
}

.library__search input {
  width: min(100%, 360px);
  height: 34px;
  padding: 0 12px;
  border: 1px solid #5c5c5c;
  background: var(--np-surface);
  font-size: 12px;
}

.library__search input:focus {
  outline: 2px solid var(--np-primary-muted);
}

.library__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 340px));
  justify-content: space-between;
  gap: 26px 40px;
  max-width: 900px;
}

.resource {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-height: 170px;
  padding: 10px 12px 12px;
  border: 1px solid var(--np-border);
  background: var(--np-surface);
}

.resource__info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.resource__info h2 {
  margin: 0 0 12px;
  color: var(--np-primary);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
}

.resource__updated {
  margin: 0 0 6px;
  font-size: 11.5px;
  text-align: center;
}

.resource__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.resource__btn {
  min-width: 90px;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 0;
  background: #0d6e66;
  font-family: var(--np-font-body);
  font-size: 11.5px;
  font-weight: 500;
}

.resource__cover {
  width: 66px;
  height: 92px;
  object-fit: cover;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
}

.share {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
}

.share label {
  font-weight: 600;
}

.share select {
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--np-border);
  border-radius: 6px;
  font-size: 13px;
}

@media (max-width: 760px) {
  .library__grid {
    grid-template-columns: 1fr;
  }
}
</style>
