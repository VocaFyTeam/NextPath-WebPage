<script setup>
import BrandLogo from '../../../shared/presentation/components/brand-logo.vue';
import LanguageSwitcher from '../../../shared/presentation/components/language-switcher.vue';

/** Teal split screen used by login and register (mock-up 1). */
defineProps({ title: { type: String, required: true } });
</script>

<template>
  <main class="auth-shell">
    <div class="auth-shell__lang"><language-switcher /></div>

    <section class="auth-shell__brand">
      <router-link :to="{ name: 'welcome' }" class="auth-shell__home" :aria-label="$t('auth.backHome')">
        <brand-logo variant="hero" light />
      </router-link>
    </section>

    <section class="auth-shell__form">
      <h1>{{ title }}</h1>
      <slot />
      <p class="auth-shell__footer"><slot name="footer" /></p>
    </section>
  </main>
</template>

<style scoped>
.auth-shell {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  min-height: 100vh;
  padding: 40px 6vw;
  background: var(--np-primary);
  color: #fff;
}

.auth-shell__lang {
  position: absolute;
  top: 18px;
  right: 22px;
}

.auth-shell__lang :deep(.language-switcher) {
  border-color: rgba(255, 255, 255, 0.6);
}

.auth-shell__lang :deep(.language-switcher__option) {
  color: #fff;
}

.auth-shell__lang :deep(.language-switcher__option.is-active) {
  background: #fff;
  color: var(--np-primary);
}

.auth-shell__brand {
  display: flex;
  justify-content: center;
}

.auth-shell__home {
  text-decoration: none;
}

.auth-shell__brand :deep(.brand__pin) {
  width: 110px;
}

.auth-shell__brand :deep(.brand__text) {
  font-size: 34px;
}

.auth-shell__form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 340px;
  justify-self: center;
}

.auth-shell__form h1 {
  margin: 0 0 22px;
  color: #fff;
  font-size: 30px;
  font-weight: 700;
}

.auth-shell__footer {
  margin: 44px 0 0;
  font-size: 13px;
}

.auth-shell__footer :deep(a) {
  color: #fff;
  font-weight: 700;
  text-decoration: none;
}

.auth-shell__footer :deep(a:hover) {
  text-decoration: underline;
}

@media (max-width: 800px) {
  .auth-shell {
    grid-template-columns: 1fr;
    gap: 34px;
    padding: 70px 22px 40px;
  }

  .auth-shell__brand :deep(.brand__pin) {
    width: 72px;
  }

  .auth-shell__brand :deep(.brand__text) {
    font-size: 26px;
  }
}
</style>

<style>
/* Shared look of the auth inputs (white pills over teal) */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.auth-input {
  width: 100%;
  height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 10px;
  background: #fff;
  color: var(--np-ink);
  font-size: 14px;
}

.auth-input::placeholder {
  color: #9a9a9a;
}

.auth-input:focus {
  outline: 3px solid rgba(255, 255, 255, 0.55);
}

.auth-submit {
  align-self: center;
  min-width: 150px;
  height: 40px;
  margin-top: 18px;
  border: 0;
  border-radius: 10px;
  background: #5fb3ae;
  color: #fff;
  font-family: var(--np-font-heading);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.6px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.auth-submit:hover:not(:disabled) {
  background: #4aa29d;
}

.auth-submit:disabled {
  opacity: 0.7;
  cursor: wait;
}

.auth-error {
  margin: 4px 0 0;
  padding: 9px 12px;
  border-radius: 8px;
  background: #fff1f0;
  color: #b42318;
  font-size: 13px;
}
</style>
