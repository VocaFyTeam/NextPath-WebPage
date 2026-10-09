
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { CounselingApi } from '../infrastructure/counseling-api.js';
import { CounselingSessionAssembler } from '../infrastructure/counseling-session.assembler.js';

const counselingApi = new CounselingApi();
const DAY = 86400000;

export const useCounselingStore = defineStore('counseling', () => {
    const psychologistSessions = ref([]);
    const studentSessions = ref([]);
    const selectedSessionId = ref(null);
    const saving = ref(false);
    const errors = ref([]);

    const byDate = (a, b) => a.timestamp - b.timestamp;

    const upcomingStudentSessions = computed(() =>
        studentSessions.value.filter(session => session.isScheduled).sort(byDate));

    const selectedSession = computed(() =>
        upcomingStudentSessions.value.find(session => session.id === selectedSessionId.value)
        ?? upcomingStudentSessions.value[0] ?? null);

    const scheduledPsychologistSessions = computed(() =>
        psychologistSessions.value.filter(session => session.isScheduled).sort(byDate));

    function sessionsInNextDays(days) {
        const now = Date.now();
        return scheduledPsychologistSessions.value.filter(session => session.timestamp >= now - DAY / 2 && session.timestamp <= now + days * DAY);
    }

    async function fetchPsychologistSessions(psychologistId) {
        try {
            const response = await counselingApi.getSessions({ psychologistId });
            psychologistSessions.value = CounselingSessionAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            errors.value.push(error);
        }
    }

    async function fetchStudentSessions(studentId) {
        try {
            const response = await counselingApi.getSessions();
            studentSessions.value = CounselingSessionAssembler.toEntitiesFromResponse(response)
                .filter(session => session.involves(studentId));
        } catch (error) {
            errors.value.push(error);
        }
    }

    function selectSession(id) {
        selectedSessionId.value = String(id);
    }

    async function saveSession(session) {
        saving.value = true;
        try {
            const resource = CounselingSessionAssembler.toResourceFromEntity(session);
            const response = session.id ? await counselingApi.updateSession(resource) : await counselingApi.createSession(resource);
            const saved = CounselingSessionAssembler.toEntityFromResource(response.data);
            const index = psychologistSessions.value.findIndex(s => s.id === saved.id);
            if (index !== -1) psychologistSessions.value[index] = saved; else psychologistSessions.value.push(saved);
            return saved;
        } catch (error) {
            errors.value.push(error);
            return null;
        } finally {
            saving.value = false;
        }
    }

    async function cancelSession(id) {
        const session = psychologistSessions.value.find(s => s.id === id);
        if (!session) return;
        session.status = 'CANCELLED';
        await saveSession(session);
    }

    return {
        psychologistSessions, studentSessions, selectedSessionId, saving, errors,
        upcomingStudentSessions, selectedSession, scheduledPsychologistSessions,
        sessionsInNextDays, fetchPsychologistSessions, fetchStudentSessions, selectSession, saveSession, cancelSession
    };
});

export default useCounselingStore;
