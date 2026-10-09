import { assetUrl } from '../../../shared/infrastructure/asset-url.js';


export class User {

    constructor({ id = null, firstName = '', lastName = '', email = '', role = 'student', avatarUrl = '' } = {}) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.avatarUrl = assetUrl(avatarUrl || User.defaultAvatarFor(role));
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`.trim();
    }

    get name() {
        return this.fullName;
    }

    get isStudent() {
        return this.role === 'student';
    }

    get isPsychologist() {
        return this.role === 'psychologist';
    }


    static defaultAvatarFor(role) {
        return role === 'psychologist' ? '/images/avatars/psychologist.svg' : '/images/avatars/student.svg';
    }
}
