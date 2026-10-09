<script setup>
import { computed, onMounted, ref } from 'vue';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useCommunityStore } from '../../application/community.store.js';
import {Comment} from '../../domain/model/comment.entity.js'

const iamStore = useIamStore();
const store = useCommunityStore();
const loading = ref(true);

const dialogVisible = ref(false);
const activeThread = ref(null);
const newComment = ref('');
const posting = ref(false);

onMounted(async () => {
  await store.fetchForum();
  loading.value = false;
});

const myCommunities = computed(() => store.myCommunities(iamStore.currentUser.id));
const authorName = computed(() => Comment.displayName(iamStore.currentUser.firstName, iamStore.currentUser.lastName));

async function openThread(thread) {
  activeThread.value = thread;
  newComment.value = '';
  dialogVisible.value = true;
  await store.fetchComments(thread.id);
}

async function publish() {
  if (!newComment.value.trim()) return;
  posting.value = true;
  await store.addComment(activeThread.value.id, authorName.value, newComment.value);
  newComment.value = '';
  posting.value = false;
}

const formatDate = iso => new Date(iso).toLocaleDateString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
</script>

<template>
  <div class="np-page">
    <section class="np-panel forum">
      <header>
        <h1 class="np-page-title np-page-title--normal forum__title">{{ $t('community.title') }}</h1>
        <p class="np-page-subtitle forum__subtitle">{{ $t('community.subtitle') }}</p>
      </header>

      <div class="forum__grid">
        <aside class="forum__communities" aria-labelledby="my-communities">
          <h2 id="my-communities" class="np-section-title forum__heading">{{ $t('community.myCommunities') }}</h2>
          <ul>
            <li v-for="community in myCommunities" :key="community.id">
              <button type="button" class="community-chip" :class="{ 'is-active': store.selectedCommunityId === community.id }"
                      :aria-pressed="store.selectedCommunityId === community.id" @click="store.selectCommunity(community.id)">
                {{ community.name }}
              </button>
            </li>
          </ul>
        </aside>

        <section aria-labelledby="threads-title">
          <h2 id="threads-title" class="np-section-title forum__heading">{{ $t('community.featuredThreads') }}</h2>

          <transition-group v-if="!loading && store.visibleThreads.length" name="fade-list" tag="ul" class="threads">
            <li v-for="thread in store.visibleThreads" :key="thread.id" class="thread">
              <h3>{{ thread.authorName }}</h3>
              <p>{{ thread.content }}</p>
              <div class="thread__footer">
                <button type="button" class="thread__count" @click="openThread(thread)">
                  • {{ $t('community.comments', thread.commentsCount) }}
                </button>
                <button type="button" class="np-btn thread__comment" @click="openThread(thread)">{{ $t('community.comment') }}</button>
              </div>
            </li>
          </transition-group>
          <p v-else-if="!loading" class="np-empty"><i class="pi pi-comments"></i>{{ $t('community.noThreads') }}</p>
          <div v-else class="threads"><div v-for="n in 3" :key="n" class="np-skeleton" style="height: 86px"></div></div>
        </section>
      </div>
    </section>

    <pv-dialog v-model:visible="dialogVisible" modal :header="activeThread?.authorName" :style="{ width: '520px' }"
               :breakpoints="{ '640px': '94vw' }">
      <p class="dialog__thread">{{ activeThread?.content }}</p>
      <ul class="dialog__comments">
        <li v-for="comment in store.comments" :key="comment.id">
          <strong>{{ comment.authorName }}</strong>
          <small>{{ formatDate(comment.createdAt) }}</small>
          <p>{{ comment.content }}</p>
        </li>
        <li v-if="!store.comments.length" class="dialog__empty">{{ $t('community.beFirst') }}</li>
      </ul>
      <form class="dialog__form" @submit.prevent="publish">
        <label for="new-comment" class="sr-only">{{ $t('community.writeComment') }}</label>
        <pv-textarea id="new-comment" v-model="newComment" rows="3" auto-resize class="w-full" :placeholder="$t('community.writeComment')" />
        <div class="dialog__actions">
          <button type="submit" class="np-btn" :disabled="posting || !newComment.trim()">{{ $t('community.publish') }}</button>
        </div>
      </form>
    </pv-dialog>
  </div>
</template>

<style scoped>
.forum {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: calc(100vh - var(--np-topbar-height) - 70px);
  padding: 14px 16px 18px;
}

.forum__title {
  font-size: 30px;
  font-weight: 600;
}

.forum__subtitle {
  max-width: 520px;
  font-size: 12px;
}

.forum__grid {
  display: grid;
  grid-template-columns: minmax(200px, 0.75fr) minmax(0, 2fr);
  gap: 10px;
  flex: 1;
}

.forum__heading {
  margin-bottom: 12px;
  font-size: 15px;
}

.forum__communities {
  padding: 10px 4px;
  border: 1px solid var(--np-border-strong);
}

.forum__communities ul {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.forum__communities .forum__heading {
  padding-left: 4px;
}

.community-chip {
  width: 100%;
  padding: 8px 6px;
  border: 1px solid var(--np-border-strong);
  background: var(--np-surface-alt);
  color: var(--np-ink);
  font-size: 12px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}

.community-chip:hover {
  border-color: var(--np-primary);
}

.community-chip.is-active {
  border-color: var(--np-primary);
  background: var(--np-primary-soft);
  color: var(--np-primary);
}

.threads {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.thread {
  padding: 12px 14px;
  border: 1px solid var(--np-border-strong);
}

.thread h3 {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 600;
}

.thread p {
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
}

.thread__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
}

.thread__count {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--np-primary);
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
}

.thread__count:hover {
  text-decoration: underline;
}

.thread__comment {
  min-width: 110px;
  border-radius: 0;
  font-family: var(--np-font-body),serif;
  font-weight: 500;
}

.dialog__thread {
  margin: 0 0 16px;
  font-size: 14px;
}

.dialog__comments {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 280px;
  margin: 0 0 14px;
  padding: 0;
  overflow-y: auto;
  list-style: none;
}

.dialog__comments li {
  padding: 8px 10px;
  border-radius: 6px;
  background: var(--np-surface-alt);
  font-size: 13px;
}

.dialog__comments small {
  margin-left: 8px;
  color: var(--np-muted);
}

.dialog__comments p {
  margin: 4px 0 0;
}

.dialog__empty {
  color: var(--np-muted);
}

.dialog__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}


@media (max-width: 800px) {
  .forum__grid {
    grid-template-columns: 1fr;
  }
}
</style>