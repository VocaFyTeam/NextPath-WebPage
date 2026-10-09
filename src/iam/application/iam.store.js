
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { IamApi } from '../infrastructure/iam-api.js';
import { UserAssembler } from '../infrastructure/user.assembler.js';
import { User } from '../domain/model/user.entity.js';

const iamApi = new IamApi();
const SESSION_KEY = 'nextpath-user';

function readStoredSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
        return raw ? new User(JSON.parse(raw)) : null;
    } catch {
        return null;
    }
}

function writeStoredSession(user, rememberMe) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify({ ...user }));
}

function clearStoredSession() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
}

export const useIamStore = defineStore('iam', () => {

    const currentUser = ref(readStoredSession());

    const loading = ref(false);

    const errors = ref([]);

    const isSignedIn = computed(() => currentUser.value !== null);
    const isStudent = computed(() => currentUser.value?.role === 'student');

    const homeRoute = computed(() =>
        currentUser.value?.role === 'psychologist' ? { name: 'dashboard' } : { name: 'student-home' });

    const user = computed(() => currentUser.value);
    const isAuthenticated = isSignedIn;


    async function signIn(command) {
        if (!command.isValid()) return { ok: false, errorKey: 'auth.errors.required' };
        loading.value = true;
        try {
            const response = await iamApi.getUsersByEmail(command.email);
            const resource = (response.data ?? []).find(u => u.password === command.password);
            if (!resource) return { ok: false, errorKey: 'auth.errors.invalidCredentials' };
            currentUser.value = UserAssembler.toEntityFromResource(resource);
            writeStoredSession(currentUser.value, command.rememberMe);
            return { ok: true };
        } catch (error) {
            errors.value.push(error);
            return { ok: false, errorKey: 'auth.errors.server' };
        } finally {
            loading.value = false;
        }
    }


    async function signUp(command) {
        if (!command.isValid()) return { ok: false, errorKey: 'auth.errors.signUpRequired' };
        loading.value = true;
        try {
            const existing = await iamApi.getUsersByEmail(command.email);
            if ((existing.data ?? []).length > 0) return { ok: false, errorKey: 'auth.errors.emailTaken' };
            const response = await iamApi.createUser(UserAssembler.toResourceFromSignUpCommand(command));
            currentUser.value = UserAssembler.toEntityFromResource(response.data);
            writeStoredSession(currentUser.value, true);
            return { ok: true };
        } catch (error) {
            errors.value.push(error);
            return { ok: false, errorKey: 'auth.errors.server' };
        } finally {
            loading.value = false;
        }
    }

    function signOut() {
        currentUser.value = null;
        clearStoredSession();
    }

    function restoreSession() {
        currentUser.value = readStoredSession();
    }

    return {
        currentUser, user, loading, errors,
        isSignedIn, isAuthenticated, isStudent, homeRoute,
        signIn, signUp, signOut, logout: signOut, restoreSession
    };
});

export default useIamStore;
