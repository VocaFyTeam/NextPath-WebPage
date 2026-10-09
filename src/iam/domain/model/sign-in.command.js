/**
 * Command used by the IAM application layer to request authentication.
 *
 * @class SignInCommand
 */
export class SignInCommand {
    /**
     * @param {Object} params - Command attributes.
     * @param {string} params.email - E-mail credential.
     * @param {string} params.password - Password credential.
     * @param {boolean} [params.rememberMe=false] - Keep the session after closing the browser.
     */
    constructor({ email, password, rememberMe = false }) {
        this.email = (email ?? '').trim().toLowerCase();
        this.password = password ?? '';
        this.rememberMe = rememberMe;
    }

    /** @returns {boolean} Whether the command has the required data. */
    isValid() {
        return this.email.length > 0 && this.password.length > 0;
    }
}
