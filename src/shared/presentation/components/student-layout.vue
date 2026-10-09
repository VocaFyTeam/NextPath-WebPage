<script setup>
import { ref } from 'vue';
import AppSidebar from './app-sidebar.vue';
import AppTopbar from './app-topbar.vue';

/** Layout of the student area: sidebar + top bar + grey content (all student mock-ups). */
const menuOpen = ref(false);
</script>

<template>
  <div class="shell">
    <app-sidebar class="np-no-print" :open="menuOpen" @navigate="menuOpen = false" />
    <div v-if="menuOpen" class="shell__backdrop" @click="menuOpen = false"></div>

    <div class="shell__main">
      <app-topbar class="np-no-print" @toggle-menu="menuOpen = !menuOpen" />
      <main class="shell__content">
        <router-view v-slot="{ Component, route }">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  min-height: 100vh;
  background: var(--np-bg);
}

.shell__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.shell__content {
  flex: 1;
  padding: 26px 34px 40px;
}

.shell__backdrop {
  position: fixed;
  inset: 0;
  z-index: 25;
  background: rgba(0, 0, 0, 0.35);
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .shell__content {
    padding: 18px 16px 32px;
  }
}

@media print {
  .shell__content {
    padding: 0;
  }
}
</style>
