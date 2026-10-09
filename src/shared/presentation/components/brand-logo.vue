<script setup>
import logoPin from '../../../images/logo-pin.png';
import logoPinWhite from '../../../images/logo-pin-white.png';

/**
 * NextPath logo.
 * - `stacked`: pin + "Next / Path" in two lines (sidebar).
 * - `hero`: big pin + "NEXT PATH" below (welcome & auth screens).
 */
defineProps({
  variant: { type: String, default: 'stacked' },
  light: { type: Boolean, default: false }
});
</script>

<template>
  <div class="brand" :class="[`brand--${variant}`, { 'brand--light': light }]">
    <img :src="light ? logoPinWhite : logoPin" alt="" class="brand__pin" aria-hidden="true" />
    <span v-if="variant === 'stacked'" class="brand__text">Next<br />Path</span>
    <span v-else class="brand__text">NEXT PATH</span>
  </div>
</template>

<style scoped>
.brand {
  display: flex;
  align-items: center;
  font-family: var(--np-font-heading);
  font-weight: 700;
  color: var(--np-primary);
}

.brand--stacked {
  gap: 8px;
}

.brand--stacked .brand__pin {
  width: 34px;
}

.brand--stacked .brand__text {
  font-size: 23px;
  line-height: 0.98;
  color: #0b5f5b;
}

.brand--hero {
  flex-direction: column;
  gap: 14px;
}

.brand--hero .brand__pin {
  width: 92px;
}

.brand--hero .brand__text {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.brand--light .brand__text {
  color: #fff;
}
</style>
