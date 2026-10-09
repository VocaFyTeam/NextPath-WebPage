<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useIamStore } from '../../application/iam.store.js';
import { SignUpCommand } from '../../domain/model/sign-up.command.js';
import AuthShell from '../components/auth-shell.vue';

const router = useRouter();
const iamStore = useIamStore();

const form = reactive({ firstName: '', lastName: '', email: '', password: '', role: '' });
const errorKey = ref('');

async function submit() {
  errorKey.value = '';
  const result = await iamStore.signUp(new SignUpCommand(form));
  if (!result.ok) {
    errorKey.value = result.errorKey;
    return;
  }
  router.push(iamStore.homeRoute);
}
</script>

<template>
  <auth-shell :title="$t('auth.signUpTitle')">
    <form class="auth-form" novalidate @submit.prevent="submit">
      <label class="sr-only" for="register-first-name">{{ $t('auth.firstName') }}</label>
      <input id="register-first-name" v-model="form.firstName" class="auth-input" type="text"
             autocomplete="given-name" :placeholder="$t('auth.firstName')" required />

      <label class="sr-only" for="register-last-name">{{ $t('auth.lastName') }}</label>
      <input id="register-last-name" v-model="form.lastName" class="auth-input" type="text"
             autocomplete="family-name" :placeholder="$t('auth.lastName')" required />

      <label class="sr-only" for="register-email">{{ $t('auth.email') }}</label>
      <input id="register-email" v-model="form.email" class="auth-input" type="email"
             autocomplete="email" :placeholder="$t('auth.email')" required />

      <label class="sr-only" for="register-password">{{ $t('auth.password') }}</label>
      <input id="register-password" v-model="form.password" class="auth-input" type="password"
             autocomplete="new-password" minlength="6" :placeholder="$t('auth.password')" required />

      <label class="sr-only" for="register-role">{{ $t('auth.role') }}</label>
      <select id="register-role" v-model="form.role" class="auth-input register__role" :class="{ 'is-empty': !form.role }" required>
        <option value="" disabled>{{ $t('auth.role') }}</option>
        <option value="student">{{ $t('auth.roles.student') }}</option>
        <option value="psychologist">{{ $t('auth.roles.psychologist') }}</option>
      </select>

      <p v-if="errorKey" class="auth-error" role="alert">{{ $t(errorKey) }}</p>

      <button type="submit" class="auth-submit" :disabled="iamStore.loading">
        <i v-if="iamStore.loading" class="pi pi-spin pi-spinner" aria-hidden="true"></i>
        {{ $t('auth.enter') }}
      </button>
    </form>

    <template #footer>
      {{ $t('auth.haveAccount') }}
      <router-link :to="{ name: 'login' }">{{ $t('auth.signInLink') }}</router-link>
    </template>
  </auth-shell>
</template>

<style scoped>
.register__role {
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, #7a7a7a 50%), linear-gradient(135deg, #7a7a7a 50%, transparent 50%);
  background-position: calc(100% - 20px) 17px, calc(100% - 15px) 17px;
  background-size: 5px 5px;
  background-repeat: no-repeat;
  cursor: pointer;
}

.register__role.is-empty {
  color: #9a9a9a;
}
</style>
