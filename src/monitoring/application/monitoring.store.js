
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { MonitoringApi } from '../infrastructure/monitoring-api.js';
import { StudentOverviewAssembler } from '../infrastructure/student-overview.assembler.js';
import { StudentGroupAssembler } from '../infrastructure/student-group.assembler.js';
import { VocationalTestAssembler } from '../../assessments/insfrastructure/vocational-test.assembler.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';
import { GroupReport } from '../domain/model/group-report.js';

const monitoringApi = new MonitoringApi();

export const RISK_FILTERS = ['all', 'highRisk', 'lowParticipation', 'inProgress', 'group'];

export const useMonitoringStore = defineStore('monitoring', () => {
    const students = ref([]);
    const groups = ref([]);
    const tests = ref([]);
    const careerNames = ref({});
    const loaded = ref(false);
    const errors = ref([]);
    const missingEndpoints = ref([]);

    const activeFilter = ref({ type: 'all', groupId: null });

    const totalStudents = computed(() => students.value.length);
    const testsTaken = computed(() => students.value.reduce((sum, student) => sum + student.completedResults.length, 0));
    const highRiskStudents = computed(() => students.value.filter(student => student.riskLevel === 'high'));
    const lowParticipationStudents = computed(() => students.value.filter(student => student.hasLowParticipation));
    const inconsistentStudents = computed(() => students.value.filter(student => student.hasInconsistentAnswers));
    const inProgressStudents = computed(() => students.value.filter(student => student.isInProgress));

    function studentsOfGroup(groupId) {
        return students.value.filter(student => student.groupId === groupId);
    }

    const filteredStudents = computed(() => {
        const filter = activeFilter.value;
        switch (filter.type) {
            case 'highRisk': return highRiskStudents.value;
            case 'lowParticipation': return lowParticipationStudents.value;
            case 'inProgress': return inProgressStudents.value;
            case 'group': return studentsOfGroup(filter.groupId);
            default: return students.value;
        }
    });

    function getStudent(studentId) {
        return students.value.find(student => student.studentId === String(studentId)) ?? null;
    }

    function getTest(testId) {
        return tests.value.find(test => test.id === String(testId)) ?? null;
    }

    function careerName(careerId) {
        return careerNames.value[String(careerId)] ?? '';
    }

    function getGroup(groupId) {
        return groups.value.find(group => group.id === groupId) ?? null;
    }

    function groupComparison(groupIds) {
        return groupIds.map(groupId => ({
            group: getGroup(groupId),
            students: studentsOfGroup(groupId),
            shares: GroupReport.dimensionShares(studentsOfGroup(groupId))
        })).filter(item => item.group);
    }


    async function fetchMonitoring(psychologistId) {
        const requests = {
            'student-profiles': monitoringApi.getStudentProfiles(psychologistId),
            users: monitoringApi.getStudents(),
            'test-results': monitoringApi.getResults(),
            tasks: monitoringApi.getTasks(),
            favorites: monitoringApi.getFavorites(),
            'vocational-tests': monitoringApi.getTests(),
            careers: monitoringApi.getCareers(),
            'student-groups': monitoringApi.getStudentGroups(psychologistId)
        };
        const names = Object.keys(requests);
        const settled = await Promise.allSettled(Object.values(requests));

        const responses = {};
        const missing = [];
        settled.forEach((outcome, index) => {
            if (outcome.status === 'fulfilled') {
                responses[names[index]] = outcome.value;
            } else {
                missing.push(names[index]);
                errors.value.push(outcome.reason);
                responses[names[index]] = { status: 200, data: [] };
            }
        });
        missingEndpoints.value = missing;

        tests.value = VocationalTestAssembler.toEntitiesFromResponse(responses['vocational-tests']);
        careerNames.value = Object.fromEntries(extractResources(responses.careers, 'careers').map(c => [String(c.id), c.name]));
        groups.value = StudentGroupAssembler.toEntitiesFromResponse(responses['student-groups']);
        students.value = StudentOverviewAssembler.toEntitiesFromResponses({
            profiles: responses['student-profiles'], students: responses.users, results: responses['test-results'],
            tasks: responses.tasks, favorites: responses.favorites
        }, tests.value.length);
        loaded.value = true;
    }

    function setFilter(filter) {
        activeFilter.value = { type: filter.type, groupId: filter.groupId ?? null };
    }

    return {
        students, groups, tests, careerNames, loaded, errors, missingEndpoints, activeFilter,
        totalStudents, testsTaken, highRiskStudents, lowParticipationStudents, inconsistentStudents, inProgressStudents,
        filteredStudents,
        studentsOfGroup, getStudent, getTest, careerName, getGroup, groupComparison,
        fetchMonitoring, setFilter
    };
});

export default useMonitoringStore;
