import { User } from '../domain/model/user.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';

/**
 * Maps IAM resources into domain entities and vice versa.
 *
 * @class UserAssembler
 */
export class UserAssembler {
    /**
     * @param {Object} resource - User resource payload.
     * @returns {User} User entity (password is never kept in the domain).
     */
    static toEntityFromResource(resource) {
        // eslint-disable-next-line no-unused-vars
        const { password, ...safe } = resource;
        return new User({ ...safe });
    }

    /**
     * @param {import('axios').AxiosResponse} response - HTTP response with user resources.
     * @returns {User[]} User entities.
     */
    static toEntitiesFromResponse(response) {
        return extractResources(response, 'users').map(resource => this.toEntityFromResource(resource));
    }

    /**
     * @param {import('../domain/model/sign-up.command.js').SignUpCommand} command - Sign-up command.
     * @returns {Object} Resource to persist.
     */
    static toResourceFromSignUpCommand(command) {
        const prefix = command.role === 'psychologist' ? 'psy' : 'std';
        return {
            id: `${prefix}-${Date.now()}`,
            firstName: command.firstName,
            lastName: command.lastName,
            email: command.email,
            password: command.password,
            role: command.role,
            avatarUrl: User.defaultAvatarFor(command.role)
        };
    }
}
