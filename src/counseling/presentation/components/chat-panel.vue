<script setup>
import { computed, nextTick, ref, watch } from 'vue';


const props = defineProps({
  conversation: { type: Object, required: true },
  messages: { type: Array, required: true },
  viewerRole: { type: String, required: true },
  viewerAvatar: { type: String, default: '' }
});
const emit = defineEmits(['send']);

const draft = ref('');
const scroller = ref(null);

const counterpart = computed(() => props.conversation.counterpart(props.viewerRole));
const lastOwnMessageId = computed(() =>
    [...props.messages].reverse().find(message => message.isOwnFor(props.viewerRole))?.id ?? null);

async function scrollToBottom() {
  await nextTick();
  if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight;
}

watch(() => props.messages.length, scrollToBottom, { immediate: true });
watch(() => props.conversation.id, scrollToBottom);

function send() {
  const text = draft.value.trim();
  if (!text) return;
  draft.value = '';
  emit('send', text);
}

const formatTime = iso => new Date(iso).toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
</script>

<template>
  <section class="chat" :aria-label="$t('messages.chat')">
    <header class="chat__header">
      <h2>{{ viewerRole === 'student' ? $t('messages.psychologist', { name: counterpart.name }) : counterpart.name }}</h2>
      <slot name="header-actions" />
    </header>

    <div ref="scroller" class="chat__messages" role="log" aria-live="polite">
      <div v-for="message in messages" :key="message.id" class="bubble-row"
           :class="message.isOwnFor(viewerRole) ? 'bubble-row--me' : 'bubble-row--them'">
        <img :src="message.isOwnFor(viewerRole) ? viewerAvatar : counterpart.avatarUrl" alt="" class="bubble-row__avatar" />
        <div class="bubble" :title="formatTime(message.sentAt)">
          <span v-if="message.text">{{ message.text }}</span>
          <div v-if="message.attachment" class="attachment">
            <img :src="message.attachment.coverUrl" alt="" class="attachment__cover" />
            <div class="attachment__body">
              <strong>{{ message.attachment.title }}</strong>
              <a :href="message.attachment.fileUrl" download target="_blank" rel="noopener" class="attachment__download">
                {{ $t('resources.download') }}
              </a>
            </div>
          </div>
        </div>
        <span v-if="message.id === lastOwnMessageId" class="bubble-row__read">
          {{ $t(message.read ? 'messages.readNow' : 'messages.sent') }}
        </span>
      </div>
      <p v-if="!messages.length" class="np-empty">{{ $t('messages.noMessages') }}</p>
    </div>

    <form class="chat__composer" @submit.prevent="send">
      <label :for="`chat-input-${conversation.id}`" class="sr-only">{{ $t('messages.placeholder') }}</label>
      <input :id="`chat-input-${conversation.id}`" v-model="draft" type="text" autocomplete="off" :placeholder="$t('messages.placeholder')" />
      <button type="submit" class="chat__send" :disabled="!draft.trim()" :aria-label="$t('messages.send')">
        <i class="pi pi-send" aria-hidden="true"></i>
      </button>
    </form>
  </section>
</template>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: calc(100vh - var(--np-topbar-height));
  padding: 10px 0 18px;
}

.chat__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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

.attachment {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
  white-space: normal;
}

.attachment__cover {
  width: 40px;
  height: 54px;
  object-fit: cover;
  background: #fff;
}

.attachment__body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.attachment__body strong {
  font-family: var(--np-font-heading);
  font-size: 13px;
}

.attachment__download {
  align-self: flex-start;
  padding: 3px 12px;
  border-radius: 4px;
  background: var(--np-primary);
  color: #fff;
  font-size: 11px;
  text-decoration: none;
}

.attachment__download:hover {
  background: var(--np-primary-hover);
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
  .chat {
    height: 70vh;
  }

  .bubble-row {
    max-width: 88%;
  }
}
</style>
