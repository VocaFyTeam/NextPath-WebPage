import { StudentOverview } from '../domain/model/student-overview.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';
import { TestResultAssembler } from '../../assessments/insfrastructure/test-result.assembler.js';

/**
 * Builds {@link StudentOverview} read models by joining the monitoring records
 * with users, test results, tasks and favorites.
 *
 * @class StudentOverviewAssembler
 */
export class StudentOverviewAssembler {
    /**
     * @param {Object} responses - HTTP responses.
     * @param {import('axios').AxiosResponse} responses.profiles - student-profiles.
     * @param {import('axios').AxiosResponse} responses.students - users with role student.
     * @param {import('axios').AxiosResponse} responses.results - test-results.
     * @param {import('axios').AxiosResponse} responses.tasks - tasks.
     * @param {import('axios').AxiosResponse} responses.favorites - favorites.
     * @param {number} totalTests - Number of tests in the catalog.
     * @returns {StudentOverview[]} In the order the psychologist registered them.
     */
    static toEntitiesFromResponses({ profiles, students, results, tasks, favorites }, totalTests) {
        const users = new Map(extractResources(students, 'users').map(user => [String(user.id), user]));
        const allResults = TestResultAssembler.toEntitiesFromResponse(results);
        const allTasks = extractResources(tasks, 'tasks');
        const allFavorites = extractResources(favorites, 'favorites');

        return extractResources(profiles, 'student-profiles')
            .filter(profile => users.has(String(profile.studentId)))
            .map(profile => {
                const studentId = String(profile.studentId);
                const user = users.get(studentId);
                const studentTasks = allTasks.filter(task => String(task.studentId) === studentId);
                return new StudentOverview({
                    studentId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatarUrl: user.avatarUrl,
                    groupId: profile.groupId ? String(profile.groupId) : null,
                    flags: profile.flags ?? [],
                    observation: profile.observation ?? '',
                    lastActivityDate: profile.lastActivityDate ?? '',
                    results: allResults.filter(result => String(result.studentId) === studentId),
                    totalTests,
                    completedTasks: studentTasks.filter(task => task.status === 'completed').length,
                    totalTasks: studentTasks.length,
                    favoriteCareerIds: allFavorites
                        .filter(favorite => String(favorite.studentId) === studentId)
                        .map(favorite => String(favorite.careerId))
                });
            });
    }
}
