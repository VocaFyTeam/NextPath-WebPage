<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useMessagingStore } from '../../application/messaging.store.js';

const iamStore = useIamStore();
const store = useMessagingStore();
const draft = ref('');
const loading = ref(true);
const scroller = ref(null);

onMounted(async () => {
  await store.fetchConversations(iamStore.currentUser.id);
  if (store.conversations.length) await store.openConversation(store.activeConversationId ?? store.conversations[0].id);
  loading.value = false;
});

async function scrollToBottom() {
  await nextTick();
  if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight;
}

watch(() => store.messages.length, scrollToBottom);
watch(() => store.activeConversationId, scrollToBottom);

const lastStudentMessageId = computed(() =>
    [...store.messages].reverse().find(message => message.isFromStudent)?.id ?? null);

async function send() {
  const text = draft.value;
  draft.value = '';
  await store.sendMessage(text);
}

const formatTime = iso => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

    <section class="chat" :aria-label="$t('messages.chat')">
      <template v-if="store.activeConversation">
        <header class="chat__header">
          <h2>{{ $t('messages.psychologist', { name: store.activeConversation.psychologistName }) }}</h2>
        </header>

        <div ref="scroller" class="chat__messages" role="log" aria-live="polite">
          <div v-for="message in store.messages" :key="message.id" class="bubble-row"
               :class="message.isFromStudent ? 'bubble-row--me' : 'bubble-row--them'">
            <img :src="message.isFromStudent ? iamStore.currentUser.avatarUrl : store.activeConversation.avatarUrl" alt="" class="bubble-row__avatar" />
            <div class="bubble" :title="formatTime(message.sentAt)">{{ message.text }}</div>
            <span v-if="message.id === lastStudentMessageId" class="bubble-row__read">
              {{ $t(message.read ? 'messages.readNow' : 'messages.sent') }}
            </span>
          </div>
        </div>

        <form class="chat__composer" @submit.prevent="send">
          <label for="chat-input" class="sr-only">{{ $t('messages.placeholder') }}</label>
          <input id="chat-input" v-model="draft" type="text" autocomplete="off" :placeholder="$t('messages.placeholder')" />
          <button type="submit" class="chat__send" :disabled="!draft.trim()" :aria-label="$t('messages.send')">
            <i class="pi pi-send" aria-hidden="true"></i>
          </button>
        </form>
      </template>
      <p v-else-if="!loading" class="np-empty">{{ $t('messages.select') }}</p>
    </section>
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
  padding-left: 0;
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

.chat {
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: calc(100vh - var(--np-topbar-height));
  padding: 10px 0 18px;
}

.chat__header {
  margin: 0 0 0 0;
  padding: 10px 14px;
  background: var(--np-surface);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
}

.chat__header h2 {
  margin: 0;
  color: var(--np-primary);
  font-size: 16px;
  font-weight: 600;
}

.chat__messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding: 16px 22px;
}

.bubble-row {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.bubble-row--them {
  align-self: flex-start;
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
}

.bubble-row--me {
  align-self: flex-end;
  align-items: flex-end;
}

.bubble-row__avatar {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}

.bubble-row--me .bubble-row__avatar {
  margin-bottom: 4px;
}

.bubble {
  padding: 6px 10px;
  border-radius: 3px;
  color: #fff;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.bubble-row--them .bubble {
  margin-top: 16px;
  background: var(--np-primary);
}

.bubble-row--me .bubble {
  margin-right: 6px;
  background: var(--np-bubble-student);
}

.bubble-row__read {
  margin-top: 6px;
  font-size: 10px;
  color: var(--np-muted);
}

.chat__composer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 22px;
  padding: 6px 6px 6px 16px;
  border: 1px solid var(--np-border);
  border-radius: 6px;
  background: var(--np-surface);
}

.chat__composer input {
  flex: 1;
  height: 32px;
  border: 0;
  font-size: 13px;
  outline: none;
}

.chat__send {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 4px;
  background: var(--np-primary);
  color: #fff;
  cursor: pointer;
}

.chat__send:disabled {
  background: #bcd9d7;
  cursor: not-allowed;
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

  .chat {
    height: 70vh;
  }

  .bubble-row {
    max-width: 88%;
  }
}
</style>
