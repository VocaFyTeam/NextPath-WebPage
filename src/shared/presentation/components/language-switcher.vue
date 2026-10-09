<script setup>
import { useI18n } from 'vue-i18n';
import { setLocale } from '../../../i18n.js';

const { locale } = useI18n();
const languages = ['es', 'en'];
</script>

<template>
  <div class="language-switcher" role="group" :aria-label="$t('common.language')">
    <button
        v-for="language in languages"
        :key="language"
        type="button"
        class="language-switcher__option"
        :class="{ 'is-active': locale === language }"
        :aria-pressed="locale === language"
        @click="setLocale(language)"
    >
      {{ language.toUpperCase() }}
    </button>
  </div>
</template>

<style scoped>
.language-switcher {
  display: inline-flex;
  border: 1px solid var(--np-border);
  border-radius: 999px;
  overflow: hidden;
}

.language-switcher__option {
  min-width: 40px;
  padding: 5px 10px;
  border: 0;
  background: transparent;
  color: var(--np-muted);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.language-switcher__option.is-active {
  background: var(--np-primary);
  color: #fff;
}
</style>
