<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import BrandLogo from './brand-logo.vue';

/**
 * Side menu shared by the student and psychologist layouts.
 * The items come from navigation-menus.js.
 */
const props = defineProps({
  open: { type: Boolean, default: false },
  /** @type {Array<{section: string, to: Object, icon: string, label: string}>} */
  items: { type: Array, required: true }
});
const emit = defineEmits(['navigate']);

const route = useRoute();

const activeSection = computed(() => route.meta?.section ?? null);
const homeRoute = computed(() => props.items[0]?.to ?? '/');
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--open': open }" :aria-label="$t('nav.mainMenu')">
    <router-link :to="homeRoute" class="sidebar__brand" @click="emit('navigate')">
      <brand-logo variant="stacked" />
    </router-link>

    <nav>
      <ul class="sidebar__menu">
        <li v-for="item in items" :key="item.section">
          <router-link
              :to="item.to"
              class="sidebar__link"
              :class="{ 'is-active': activeSection === item.section }"
              :aria-current="activeSection === item.section ? 'page' : undefined"
              @click="emit('navigate')"
          >
            <i :class="item.icon" aria-hidden="true"></i>
            <span>{{ $t(item.label) }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  width: var(--np-sidebar-width);
  height: 100vh;
  padding: 18px 0 24px;
  background: var(--np-surface);
  z-index: 30;
}

.sidebar__brand {
  display: block;
  padding: 0 0 24px 16px;
  text-decoration: none;
}

.sidebar__menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sidebar__link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 44px;
  padding: 6px 14px 6px 18px;
  color: var(--np-text);
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.15;
  text-decoration: none;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.sidebar__link i {
  width: 22px;
  font-size: 19px;
  color: #3d3d3d;
  text-align: center;
}

.sidebar__link:hover {
  background: var(--np-primary-soft);
}

.sidebar__link.is-active {
  color: var(--np-primary);
  font-weight: 600;
}

.sidebar__link.is-active i {
  color: var(--np-primary);
}

.sidebar__link.is-active::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  border-radius: 2px;
  background: var(--np-primary);
}

@media (max-width: 900px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(-100%);
    box-shadow: var(--np-shadow-lg);
    transition: transform 0.2s ease;
  }

  .sidebar--open {
    transform: translateX(0);
  }
}
</style>
