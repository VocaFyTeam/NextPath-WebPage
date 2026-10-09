<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useIamStore } from '../../application/iam.store.js';
import { SignInCommand } from '../../domain/model/sign-in.command.js';
import AuthShell from '../components/auth-shell.vue';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const { t } = useI18n();
const iamStore = useIamStore();

const form = reactive({ email: '', password: '', rememberMe: false });
const errorKey = ref('');

async function submit() {
  errorKey.value = '';
  const result = await iamStore.signIn(new SignInCommand(form));
  if (!result.ok) {
    errorKey.value = result.errorKey;
    return;
  }
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null;
  router.push(redirect && iamStore.isStudent ? redirect : iamStore.homeRoute);
}

function forgotPassword() {
  toast.add({ severity: 'info', summary: t('auth.forgotPassword'), detail: t('auth.forgotPasswordDetail'), life: 4500 });
}
</script>

<template>
  <auth-shell :title="$t('auth.signInTitle')">
    <form class="auth-form" novalidate @submit.prevent="submit">
      <label class="sr-only" for="login-email">{{ $t('auth.emailPlaceholder') }}</label>
      <input id="login-email" v-model="form.email" class="auth-input" type="email" autocomplete="email"
             :placeholder="$t('auth.emailPlaceholder')" required />

      <label class="sr-only" for="login-password">{{ $t('auth.password') }}</label>
      <input id="login-password" v-model="form.password" class="auth-input" type="password"
             autocomplete="current-password" :placeholder="$t('auth.password')" required />

      <div class="login__options">
        <label class="login__remember">
          <input v-model="form.rememberMe" type="checkbox" />
          <span>{{ $t('auth.rememberMe') }}</span>
        </label>
        <button type="button" class="login__forgot" @click="forgotPassword">{{ $t('auth.forgotPassword') }}</button>
      </div>

      <p v-if="errorKey" class="auth-error" role="alert">{{ $t(errorKey) }}</p>

      <button type="submit" class="auth-submit" :disabled="iamStore.loading">
        <i v-if="iamStore.loading" class="pi pi-spin pi-spinner" aria-hidden="true"></i>
        {{ $t('auth.enter') }}
      </button>
    </form>

    <template #footer>
      {{ $t('auth.noAccount') }}
      <router-link :to="{ name: 'register' }">{{ $t('auth.registerLink') }}</router-link>
    </template>
  </auth-shell>
</template>

<style scoped>
.login__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 4px;
  font-size: 11.5px;
}

.login__remember {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.login__remember input {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: #fff;
  cursor: pointer;
}

.login__forgot {
  padding: 0;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 11.5px;
  cursor: pointer;
}

.login__forgot:hover {
  text-decoration: underline;
}
</style>
