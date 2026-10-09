<script setup>
</script>
<template>
  <main class="home">
    <section class="hero">
      <p class="eyebrow">NEXT PATH</p>

      <h1>{{ $t('home.title') }}</h1>

      <p class="description">
        {{ $t('home.description') }}
      </p>

      <div class="actions">
        <router-link to="/about" class="primary-button">
          {{ $t('navigation.about') }}
        </router-link>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.hero {
  width: 100%;
  max-width: 900px;
  text-align: center;
}

.eyebrow {
  margin-bottom: 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2rem;
}

h1 {
  margin: 0;
  font-size: clamp(2.5rem, 6vw, 5rem);
}

.description {
  max-width: 650px;
  margin: 1.5rem auto;
  font-size: 1.15rem;
  line-height: 1.7;
  color: #64748b;
}

.primary-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  border-radius: 0.75rem;
  background: #1e293b;
  color: white;
  transition: 0.2s ease;
}

.primary-button:hover {
  transform: translateY(-2px);
}
</style>