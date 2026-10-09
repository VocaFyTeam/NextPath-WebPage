/**
 * User aggregate of the IAM bounded context.
 *
 * @class User
 */
export class User {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?string} [params.id=null] - Unique user identifier.
     * @param {string} [params.firstName=''] - First name.
     * @param {string} [params.lastName=''] - Last name.
     * @param {string} [params.email=''] - E-mail used to sign in.
     * @param {'student'|'psychologist'} [params.role='student'] - User role.
     * @param {string} [params.avatarUrl=''] - Avatar image URL.
     */
    constructor({ id = null, firstName = '', lastName = '', email = '', role = 'student', avatarUrl = '' } = {}) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.avatarUrl = avatarUrl || User.defaultAvatarFor(role);
    }

    /** @returns {string} Full name of the user. */
    get fullName() {
        return `${this.firstName} ${this.lastName}`.trim();
    }

    /** @returns {string} Alias of fullName (kept for views that use `user.name`). */
    get name() {
        return this.fullName;
    }

    /** @returns {boolean} Whether the user is a student. */
    get isStudent() {
        return this.role === 'student';
    }

    /** @returns {boolean} Whether the user is a psychologist. */
    get isPsychologist() {
        return this.role === 'psychologist';
    }

    /**
     * @param {string} role - User role.
     * @returns {string} Default avatar for the role.
     */
    static defaultAvatarFor(role) {
        return role === 'psychologist' ? '/images/avatars/psychologist.svg' : '/images/avatars/student.svg';
    }
}
