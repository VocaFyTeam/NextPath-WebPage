import { User } from '../domain/model/user.entity.js';
import { extractResources } from '../../shared/infrastructure/base-assembler.js';


export class UserAssembler {

    static toEntityFromResource(resource) {
        // eslint-disable-next-line no-unused-vars
        const { password, ...safe } = resource;
        return new User({ ...safe });
    }

    static toEntitiesFromResponse(response) {
        return extractResources(response, 'users').map(resource => this.toEntityFromResource(resource));
    }

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
