<script setup>
</script>
<template>
  <main class="page">
    <h1>About NextPath</h1>

    <p>
      NextPath is a digital solution designed to support students
      in their vocational and professional decision-making process.
    </p>

    <router-link to="/">
      ← Back to Home
    </router-link>
  </main>
</template>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.page h1 {
  margin-bottom: 1rem;
}

.page p {
  line-height: 1.7;
  color: #64748b;
  margin-bottom: 2rem;
}

.page a {
  font-weight: 600;
}
</style>