<script setup>
import BrandLogo from '../../../shared/presentation/components/brand-logo.vue';
import LanguageSwitcher from '../../../shared/presentation/components/language-switcher.vue';
</script>

<template>
  <main class="welcome">
    <div class="welcome__lang"><language-switcher /></div>

    <section class="welcome__hero">
      <brand-logo variant="hero" />
      <p class="welcome__tagline">{{ $t('auth.tagline') }}</p>

      <div class="welcome__actions">
        <router-link :to="{ name: 'login' }" class="np-btn np-btn--sm welcome__btn">{{ $t('auth.logIn') }}</router-link>
        <router-link :to="{ name: 'register' }" class="np-btn np-btn--sm welcome__btn">{{ $t('auth.signUp') }}</router-link>
      </div>
    </section>
  </main>
</template>

<style scoped>
.welcome {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background: #fff;
}

.welcome__lang {
  position: absolute;
  top: 18px;
  right: 22px;
}

.welcome__hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.welcome__hero :deep(.brand__pin) {
  width: 110px;
}

.welcome__hero :deep(.brand__text) {
  font-size: 36px;
}

.welcome__tagline {
  max-width: 260px;
  margin: 10px 0 30px;
  color: var(--np-primary);
  font-size: 13px;
  line-height: 1.4;
}

.welcome__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.welcome__btn {
  min-width: 96px;
  border-radius: 6px;
  font-family: var(--np-font-body);
  font-weight: 500;
}
</style>
