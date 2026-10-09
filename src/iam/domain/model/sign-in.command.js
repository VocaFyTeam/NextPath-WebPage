
export class SignInCommand {

    constructor({ email, password, rememberMe = false }) {
        this.email = (email ?? '').trim().toLowerCase();
        this.password = password ?? '';
        this.rememberMe = rememberMe;
    }

    isValid() {
        return this.email.length > 0 && this.password.length > 0;
    }
}
