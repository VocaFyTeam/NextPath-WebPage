
export class SignUpCommand {

    constructor({ firstName, lastName, email, password, role }) {
        this.firstName = (firstName ?? '').trim();
        this.lastName = (lastName ?? '').trim();
        this.email = (email ?? '').trim().toLowerCase();
        this.password = password ?? '';
        this.role = role || 'student';
    }

    isValid() {
        return Boolean(this.firstName && this.lastName && this.email && this.password.length >= 6 && this.role);
    }
}
