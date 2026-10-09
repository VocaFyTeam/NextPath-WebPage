
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { CounselingApi } from '../infrastructure/counseling-api.js';
import { ConversationAssembler } from '../infrastructure/conversation.assembler.js';
import { MessageAssembler } from '../infrastructure/message.assembler.js';
import { Conversation } from '../domain/model/conversation.entity.js';
import { Message } from '../domain/model/message.entity.js';

const counselingApi = new CounselingApi();

export const useMessagingStore = defineStore('messaging', () => {
    const conversations = ref([]);
    const messages = ref([]);
    const activeConversationId = ref(null);
    const loadingMessages = ref(false);
    const errors = ref([]);

    const activeConversation = computed(() =>
        conversations.value.find(conversation => conversation.id === activeConversationId.value) ?? null);

    async function loadConversations(filters) {
        try {
            const response = await counselingApi.getConversations(filters);
            conversations.value = ConversationAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            errors.value.push(error);
        }
    }

    function fetchConversations(studentId) {
        return loadConversations({ studentId });
    }

    function fetchPsychologistConversations(psychologistId) {
        return loadConversations({ psychologistId });
    }

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

    async function postMessage(conversationId, text, senderRole, attachment = null) {
        const message = new Message({ conversationId, senderRole, text: (text ?? '').trim(), read: false, attachment });
        try {
            const response = await counselingApi.createMessage(MessageAssembler.toResourceFromEntity(message));
            if (conversationId === activeConversationId.value) {
                messages.value.push(MessageAssembler.toEntityFromResource(response.data));
            }
            return true;
        } catch (error) {
            errors.value.push(error);
            return false;
        }
    }

    async function sendMessage(text, senderRole = 'student') {
        if (!(text ?? '').trim() || !activeConversationId.value) return false;
        return postMessage(activeConversationId.value, text, senderRole);
    }

    async function findOrCreateConversation({ studentId, studentName, psychologistId, psychologistName }) {
        const cached = conversations.value.find(c => c.studentId === studentId && c.psychologistId === psychologistId);
        if (cached) return cached;
        try {
            const existing = ConversationAssembler.toEntitiesFromResponse(
                await counselingApi.getConversations({ studentId, psychologistId }))[0];
            if (existing) {
                conversations.value.push(existing);
                return existing;
            }
            const entity = new Conversation({ studentId, studentName, psychologistId, psychologistName });
            const response = await counselingApi.createConversation(ConversationAssembler.toResourceFromEntity(entity));
            const created = ConversationAssembler.toEntityFromResource(response.data);
            conversations.value.push(created);
            return created;
        } catch (error) {
            errors.value.push(error);
            return null;
        }
    }

    async function sendDirect({ senderRole, text, attachment = null, ...participants }) {
        const conversation = await findOrCreateConversation(participants);
        if (!conversation) return false;
        return postMessage(conversation.id, text, senderRole, attachment);
    }

    return {
        conversations, messages, activeConversationId, activeConversation, loadingMessages, errors,
        fetchConversations, fetchPsychologistConversations, openConversation, sendMessage, findOrCreateConversation, sendDirect
    };
});

export default useMessagingStore;
