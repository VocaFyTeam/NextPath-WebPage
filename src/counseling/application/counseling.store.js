
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { CounselingApi } from '../infrastructure/counseling-api.js';
import { CounselingSessionAssembler } from '../infrastructure/counseling-session.assembler.js';
import { CounselingSession } from '../domain/model/counseling-session.entity.js';

const counselingApi = new CounselingApi();

export const useCounselingStore = defineStore('counseling', () => {
    const sessions = ref([]);
    const studentSessions = ref([]);
    const selectedSessionId = ref(null);
    const errors = ref([]);

    const upcomingStudentSessions = computed(() =>
        studentSessions.value.filter(session => session.isScheduled).sort((a, b) => a.timestamp - b.timestamp));

    const selectedSession = computed(() =>
        upcomingStudentSessions.value.find(session => session.id === selectedSessionId.value)
        ?? upcomingStudentSessions.value[0] ?? null);

    async function fetchSessions() {
        try {
            const response = await counselingApi.getSessions();
            sessions.value = CounselingSessionAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            errors.value.push(error);
        }
    }

    async function fetchStudentSessions(studentId) {
        try {
            const response = await counselingApi.getSessions({ studentId });
            studentSessions.value = CounselingSessionAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            errors.value.push(error);
        }
    }


    function selectSession(id) {
        selectedSessionId.value = String(id);
    }

    async function addSession(sessionData) {
        const entity = new CounselingSession({ ...sessionData });
        try {
            const response = await counselingApi.createSession(CounselingSessionAssembler.toResourceFromEntity(entity));
            sessions.value.push(CounselingSessionAssembler.toEntityFromResource(response.data));
        } catch (error) {
            errors.value.push(error);
            sessions.value.push(new CounselingSession({ ...sessionData, id: String(Date.now()) }));
        }
    }

    async function cancelSession(id) {
        const session = sessions.value.find(s => s.id === id);
        if (!session) return;
        session.status = 'CANCELLED';
        try {
            await counselingApi.updateSession(CounselingSessionAssembler.toResourceFromEntity(session));
        } catch (error) {
            errors.value.push(error);
        }
    }

    return {
        sessions, studentSessions, selectedSessionId, errors,
        upcomingStudentSessions, selectedSession,
        fetchSessions, fetchStudentSessions, selectSession, addSession, cancelSession
    };
});

export default useCounselingStore;
