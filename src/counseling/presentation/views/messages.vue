<script setup>
import { onMounted, ref } from 'vue';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useMessagingStore } from '../../application/messaging.store.js';
import ChatPanel from '../components/chat-panel.vue';

/** Student messages with psychologists (mock-up 11). */
const iamStore = useIamStore();
const store = useMessagingStore();
const loading = ref(true);

onMounted(async () => {
  await store.fetchConversations(iamStore.currentUser.id);
  const keep = store.conversations.some(c => c.id === store.activeConversationId);
  if (store.conversations.length) await store.openConversation(keep ? store.activeConversationId : store.conversations[0].id);
  loading.value = false;
});
</script>

<template>
  <div class="messages">
    <aside class="messages__sidebar">
      <h1 class="np-page-title messages__title">{{ $t('messages.title') }}</h1>
      <div class="messages__list-panel">
        <ul class="messages__list" :aria-label="$t('messages.conversations')">
          <li v-for="conversation in store.conversations" :key="conversation.id">
            <button type="button" class="contact" :class="{ 'is-active': conversation.id === store.activeConversationId }"
                    :aria-current="conversation.id === store.activeConversationId ? 'true' : undefined"
                    @click="store.openConversation(conversation.id)">
              <img :src="conversation.avatarUrl" alt="" />
              <span>{{ $t('messages.psychologist', { name: conversation.psychologistName }) }}</span>
            </button>
          </li>
        </ul>
        <p v-if="!loading && !store.conversations.length" class="np-empty">{{ $t('messages.noConversations') }}</p>
      </div>
    </aside>

    <chat-panel v-if="store.activeConversation" :conversation="store.activeConversation" :messages="store.messages"
                viewer-role="student" :viewer-avatar="iamStore.currentUser.avatarUrl"
                @send="text => store.sendMessage(text, 'student')" />
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
  padding: 6px 4px;
  border: 1px solid var(--np-border-strong);
  background: var(--np-surface);
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
