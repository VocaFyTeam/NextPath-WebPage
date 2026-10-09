
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { CounselingApi } from '../../../../../nextpath-frontend-estudiante/nextpath/src/counseling/infrastructure/counseling-api.js';
import { ConversationAssembler } from '../../../../../nextpath-frontend-estudiante/nextpath/src/counseling/infrastructure/conversation.assembler.js';
import { MessageAssembler } from '../../../../../nextpath-frontend-estudiante/nextpath/src/counseling/infrastructure/message.assembler.js';
import { Message } from '../../../../../nextpath-frontend-estudiante/nextpath/src/counseling/domain/model/message.entity.js';

const counselingApi = new CounselingApi();

export const useMessagingStore = defineStore('messaging', () => {
    /** @type {import('vue').Ref<import('../domain/model/conversation.entity.js').Conversation[]>} */
    const conversations = ref([]);
    /** @type {import('vue').Ref<Message[]>} */
    const messages = ref([]);
    const activeConversationId = ref(null);
    const loadingMessages = ref(false);
    const errors = ref([]);

    const activeConversation = computed(() =>
        conversations.value.find(conversation => conversation.id === activeConversationId.value) ?? null);

    /** @param {string} studentId */
    async function fetchConversations(studentId) {
        try {
            const response = await counselingApi.getConversationsByStudentId(studentId);
            conversations.value = ConversationAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            errors.value.push(error);
        }
    }

    /** @param {string} conversationId - Opens a conversation and loads its messages. */
    async function openConversation(conversationId) {
        activeConversationId.value = String(conversationId);
        loadingMessages.value = true;
        try {
            const response = await counselingApi.getMessagesByConversationId(conversationId);
            messages.value = MessageAssembler.toEntitiesFromResponse(response)
                .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
        } catch (error) {
            errors.value.push(error);
        } finally {
            loadingMessages.value = false;
        }
    }

    /** @param {string} text - Sends a message from the student to the active conversation. */
    async function sendMessage(text) {
        const body = (text ?? '').trim();
        if (!body || !activeConversationId.value) return;
        const message = new Message({
            conversationId: activeConversationId.value, senderRole: 'student', text: body, read: false
        });
        try {
            const response = await counselingApi.createMessage(MessageAssembler.toResourceFromEntity(message));
            messages.value.push(MessageAssembler.toEntityFromResource(response.data));
        } catch (error) {
            errors.value.push(error);
        }
    }

    return {
        conversations, messages, activeConversationId, activeConversation, loadingMessages, errors,
        fetchConversations, openConversation, sendMessage
    };
});

export default useMessagingStore;
