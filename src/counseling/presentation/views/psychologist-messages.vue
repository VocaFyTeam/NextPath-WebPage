<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useMessagingStore } from '../../application/messaging.store.js';
import ChatPanel from '../components/chat-panel.vue';

/** Psychologist direct messages with students (mock-up 16). */
const route = useRoute();
const iamStore = useIamStore();
const store = useMessagingStore();
const loading = ref(true);
const search = ref('');

onMounted(async () => {
  await store.fetchPsychologistConversations(iamStore.currentUser.id);
  const requested = store.conversations.find(c => c.studentId === route.query.studentId);
  const keep = store.conversations.find(c => c.id === store.activeConversationId);
  const target = requested ?? keep ?? store.conversations[0];
  if (target) await store.openConversation(target.id);
  loading.value = false;
});

const normalize = text => (text ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const visibleConversations = computed(() =>
    store.conversations.filter(conversation => normalize(conversation.studentName).includes(normalize(search.value))));
</script>

<template>
  <div class="messages">
    <aside class="messages__sidebar">
      <h1 class="np-page-title messages__title">{{ $t('messages.title') }}</h1>
      <div class="messages__list-panel">
        <label class="messages__search">
          <span class="sr-only">{{ $t('messages.searchPlaceholder') }}</span>
          <input v-model="search" type="search" :placeholder="$t('messages.searchPlaceholder')" />
        </label>
        <ul class="messages__list" :aria-label="$t('messages.conversations')">
          <li v-for="conversation in visibleConversations" :key="conversation.id">
            <button type="button" class="contact" :class="{ 'is-active': conversation.id === store.activeConversationId }"
                    :aria-current="conversation.id === store.activeConversationId ? 'true' : undefined"
                    @click="store.openConversation(conversation.id)">
              <img :src="conversation.studentAvatarUrl" alt="" />
              <span>{{ conversation.studentName }}</span>
            </button>
          </li>
        </ul>
        <p v-if="!loading && !visibleConversations.length" class="np-empty">{{ $t('messages.noConversations') }}</p>
      </div>
    </aside>

    <chat-panel v-if="store.activeConversation" :conversation="store.activeConversation" :messages="store.messages"
                viewer-role="psychologist" :viewer-avatar="iamStore.currentUser.avatarUrl"
                @send="text => store.sendMessage(text, 'psychologist')">
      <template #header-actions>
        <router-link :to="{ name: 'student-monitoring', query: { studentId: store.activeConversation.studentId } }"
                     class="np-btn np-btn--sm messages__profile">
          {{ $t('messages.viewStudentProfile') }}
        </router-link>
      </template>
    </chat-panel>
    <p v-else-if="!loading" class="np-empty">{{ $t('messages.select') }}</p>
  </div>
</template>

<style scoped>
.messages {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(0, 1.75fr);
  margin: -26px -34px -40px;
  min-height: calc(100vh - var(--np-topbar-height));
}

.messages__sidebar {
  display: flex;
  flex-direction: column;
  padding: 20px 14px 18px;
  border-right: 2px solid #5c5c5c;
}

.messages__title {
  margin: 0 0 22px;
}

.messages__list-panel {
  flex: 1;
  padding: 10px 6px;
  border: 1px solid var(--np-border-strong);
  background: var(--np-surface);
}

.messages__search input {
  width: 100%;
  height: 30px;
  margin-bottom: 14px;
  padding: 0 12px;
  border: 1px solid #5c5c5c;
  font-size: 12px;
}

.messages__search input:focus {
  outline: 2px solid var(--np-primary-muted);
}

.messages__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.contact {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--np-border);
  background: var(--np-surface-alt);
  color: var(--np-primary);
  font-family: var(--np-font-heading);
  font-size: 15px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.contact img {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
}

.contact:hover,
.contact.is-active {
  border-color: var(--np-primary);
}

.contact.is-active {
  background: var(--np-primary-soft);
}

.messages__profile {
  border-radius: 0;
  font-family: var(--np-font-body);
  font-weight: 500;
  font-size: 11px;
}

@media (max-width: 900px) {
  .messages {
    grid-template-columns: 1fr;
    margin: -18px -16px -32px;
  }

  .messages__sidebar {
    border-right: 0;
    border-bottom: 2px solid #5c5c5c;
  }
}
</style>
