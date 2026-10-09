<script setup>
import BrandLogo from '../components/brand-logo.vue';
</script>

<template>
  <main class="not-found">
    <brand-logo variant="hero" />
    <p class="code">404</p>
    <h1>{{ $t('notFound.title') }}</h1>
    <p>{{ $t('notFound.description') }}</p>
    <router-link to="/" class="np-btn">{{ $t('notFound.back') }}</router-link>
  </main>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 2rem;
  text-align: center;
  background: #fff;
}

.code {
  margin: 18px 0 0;
  font-family: var(--np-font-heading);
  font-size: 4.5rem;
  font-weight: 800;
  color: var(--np-primary);
}

.not-found h1 {
  margin: 0;
}

.not-found p:not(.code) {
  margin: 0 0 1.5rem;
  color: var(--np-muted);
}
</style>
