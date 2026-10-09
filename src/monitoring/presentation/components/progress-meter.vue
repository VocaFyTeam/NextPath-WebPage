<script setup>
/** Horizontal progress bar with the percentage inside (dashboard "Avance vocacional"). */
defineProps({
  value: { type: Number, required: true },
  label: { type: String, default: '' }
});
</script>

<template>
  <div class="meter" role="progressbar" :aria-valuenow="value" aria-valuemin="0" aria-valuemax="100" :aria-label="label">
    <div class="meter__fill" :style="{ width: `${Math.max(value, 6)}%` }">
      <span>{{ value }} %</span>
    </div>
  </div>
</template>

<style scoped>
.meter {
  width: 100%;
  max-width: 170px;
  height: 13px;
  background: #d9d9d9;
}

.meter__fill {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #0b5a4b;
  transition: width 0.5s ease;
}

.meter__fill span {
  color: #fff;
  font-size: 8.5px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
