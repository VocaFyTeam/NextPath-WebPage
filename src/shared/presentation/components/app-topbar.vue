<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useIamStore } from '../../../iam/application/iam.store.js';
import LanguageSwitcher from './language-switcher.vue';

const emit = defineEmits(['toggle-menu']);

const router = useRouter();
const iamStore = useIamStore();
const menuOpen = ref(false);
const menuRef = ref(null);

function closeOnOutsideClick(event) {
  if (menuRef.value && !menuRef.value.contains(event.target)) menuOpen.value = false;
}

function closeOnEscape(event) {
  if (event.key === 'Escape') menuOpen.value = false;
}

onMounted(() => {
  document.addEventListener('click', closeOnOutsideClick);
  document.addEventListener('keydown', closeOnEscape);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnOutsideClick);
  document.removeEventListener('keydown', closeOnEscape);
});

function signOut() {
  iamStore.signOut();
  router.push({ name: 'login' });
}
</script>

<template>
  <header class="topbar">
    <button type="button" class="topbar__hamburger" :aria-label="$t('nav.openMenu')" @click="emit('toggle-menu')">
      <i class="pi pi-bars" aria-hidden="true"></i>
    </button>

    <div ref="menuRef" class="topbar__profile">
      <button
          type="button"
          class="topbar__avatar"
          :aria-label="$t('nav.profileMenu')"
          aria-haspopup="menu"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
      >
        <img :src="iamStore.currentUser?.avatarUrl" :alt="iamStore.currentUser?.fullName" />
      </button>

      <transition name="fade">
        <div v-if="menuOpen" class="topbar__menu" role="menu">
          <div class="topbar__user">
            <strong>{{ iamStore.currentUser?.fullName }}</strong>
            <span>{{ iamStore.currentUser?.email }}</span>
          </div>
          <div class="topbar__row">
            <span>{{ $t('common.language') }}</span>
            <language-switcher />
          </div>
          <button type="button" class="topbar__signout" role="menuitem" @click="signOut">
            <i class="pi pi-sign-out" aria-hidden="true"></i>
            {{ $t('auth.signOut') }}
          </button>
        </div>
      </transition>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: var(--np-topbar-height);
  padding: 0 30px;
  background: var(--np-surface);
  box-shadow: 0 3px 3px -1px rgba(0, 0, 0, 0.22);
}

.topbar__hamburger {
  display: none;
  margin-right: auto;
  border: 0;
  background: transparent;
  font-size: 22px;
  color: var(--np-primary);
  cursor: pointer;
}

.topbar__profile {
  position: relative;
}

.topbar__avatar {
  width: 46px;
  height: 46px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
}

.topbar__avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.topbar__avatar:focus-visible {
  outline: 3px solid var(--np-primary-muted);
  outline-offset: 2px;
}

.topbar__menu {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: 250px;
  padding: 14px;
  border: 1px solid var(--np-border);
  border-radius: var(--np-radius);
  background: var(--np-surface);
  box-shadow: var(--np-shadow-lg);
}

.topbar__user {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--np-border);
}

.topbar__user strong {
  font-family: var(--np-font-heading);
  color: var(--np-ink);
}

.topbar__user span {
  font-size: 12px;
  color: var(--np-muted);
  word-break: break-all;
}

.topbar__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 13px;
}

.topbar__signout {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 10px;
  border: 0;
  border-radius: var(--np-radius-sm);
  background: var(--np-surface-alt);
  color: var(--np-danger);
  font-weight: 600;
  cursor: pointer;
}

.topbar__signout:hover {
  background: #fbeaea;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 900px) {
  .topbar {
    padding: 0 16px;
    height: 64px;
  }

  .topbar__hamburger {
    display: inline-flex;
  }
}
</style>
