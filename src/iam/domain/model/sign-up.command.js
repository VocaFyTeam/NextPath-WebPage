/**
 * Command used by the IAM application layer to register a new user.
 *
 * @class SignUpCommand
 */
export class SignUpCommand {
    /**
     * @param {Object} params - Command attributes.
     * @param {string} params.firstName - First name.
     * @param {string} params.lastName - Last name.
     * @param {string} params.email - E-mail.
     * @param {string} params.password - Password.
     * @param {'student'|'psychologist'} params.role - Selected role.
     */
    constructor({ firstName, lastName, email, password, role }) {
        this.firstName = (firstName ?? '').trim();
        this.lastName = (lastName ?? '').trim();
        this.email = (email ?? '').trim().toLowerCase();
        this.password = password ?? '';
        this.role = role || 'student';
    }

    /** @returns {boolean} Whether the command has the required data. */
    isValid() {
        return Boolean(this.firstName && this.lastName && this.email && this.password.length >= 6 && this.role);
    }
}
