<script setup>

defineProps({
  /** @type {import('../../domain/model/career.entity.js').Career} */
  career: { type: Object, required: true },
  selectable: { type: Boolean, default: false },
  selected: { type: Boolean, default: false }
});
const emit = defineEmits(['toggle-select']);
</script>

<template>
  <article class="career-card" :class="{ 'is-selected': selected }">
    <div class="career-card__media">
      <img :src="career.imageUrl" :alt="career.name" loading="lazy" />
      <button
          v-if="selectable"
          type="button"
          class="career-card__check"
          :class="{ 'is-checked': selected }"
          :aria-pressed="selected"
          :aria-label="$t(selected ? 'careers.removeFromComparison' : 'careers.addToComparison', { name: career.name })"
          v-tooltip.left="$t(selected ? 'careers.removeFromComparison' : 'careers.addToComparison', { name: career.name })"
          @click="emit('toggle-select', career.id)"
      >
        <i v-if="selected" class="pi pi-check" aria-hidden="true"></i>
      </button>
    </div>

    <div class="career-card__body">
      <h3><span aria-hidden="true">{{ career.emoji }}</span> {{ career.name }}:</h3>
      <p>{{ career.shortDescription }}</p>
    </div>

    <div class="career-card__actions">
      <slot name="actions" />
    </div>
  </article>
</template>

<style scoped>
.career-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 12px;
  background: var(--np-surface);
  box-shadow: var(--np-shadow);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.career-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--np-shadow-lg);
}

.career-card.is-selected {
  outline: 2px solid var(--np-primary);
}

.career-card__media {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--np-surface-alt);
}

.career-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.career-card__check {
  position: absolute;
  top: 8px;
  right: 8px;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 2px solid #1d1d1f;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
}

.career-card__check.is-checked {
  background: #1d1d1f;
  color: #fff;
}

.career-card__check i {
  font-size: 11px;
  font-weight: 700;
}

.career-card__check:focus-visible {
  outline: 3px solid var(--np-primary-muted);
}

.career-card__body {
  flex: 1;
  padding: 12px 16px 6px;
}

.career-card__body h3 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: var(--np-ink);
}

.career-card__body p {
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
  color: var(--np-text);
}

.career-card__actions {
  padding: 10px 16px 14px;
}
</style>
