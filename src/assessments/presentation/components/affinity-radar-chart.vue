<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { AFFINITY_DIMENSIONS } from '../../domain/model/affinity-profile.js';

/**
 * Radar ("Diagrama de afinidad") drawn with plain SVG.
 * Axes are drawn clockwise starting at the top, in AFFINITY_DIMENSIONS order.
 */

const props = defineProps({
  /** @type {import('../../domain/model/affinity-profile.js').AffinityProfile} */
  profile: { type: Object, required: true }
});

const { t } = useI18n();

const SIZE = 360;
const CENTER = SIZE / 2;
const RADIUS = 110;
const RINGS = [0.25, 0.5, 0.75, 1];

function point(index, ratio) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / AFFINITY_DIMENSIONS.length;
  return [CENTER + Math.cos(angle) * RADIUS * ratio, CENTER + Math.sin(angle) * RADIUS * ratio];
}

const toPoints = list => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

const rings = computed(() => RINGS.map(ratio => toPoints(AFFINITY_DIMENSIONS.map((_, i) => point(i, ratio)))));
const axes = computed(() => AFFINITY_DIMENSIONS.map((_, i) => point(i, 1)));
const shape = computed(() => toPoints(AFFINITY_DIMENSIONS.map((d, i) => point(i, (props.profile[d] ?? 0) / 100))));
const vertices = computed(() => AFFINITY_DIMENSIONS.map((d, i) => point(i, (props.profile[d] ?? 0) / 100)));

const labels = computed(() => AFFINITY_DIMENSIONS.map((dimension, i) => {
  const [x, y] = point(i, 1.22);
  const anchor = Math.abs(x - CENTER) < 4 ? 'middle' : x > CENTER ? 'start' : 'end';
  const lines = t(`dimensions.${dimension}.radar`).split('/').map((part, idx, arr) => part.trim() + (idx < arr.length - 1 ? ' /' : ''));
  return { dimension, x, y: i === 0 ? y - 10 : y, anchor, lines, value: props.profile[dimension] ?? 0 };
}));

const description = computed(() => AFFINITY_DIMENSIONS
    .map(dimension => `${t(`dimensions.${dimension}.name`)}: ${props.profile[dimension] ?? 0}%`).join(', '));
</script>

<template>
  <figure class="radar">
    <svg :viewBox="`0 0 ${SIZE} ${SIZE}`" role="img" :aria-label="description">
      <polygon v-for="(ring, i) in rings" :key="i" :points="ring" class="radar__ring" />
      <line v-for="([x, y], i) in axes" :key="`axis-${i}`" :x1="CENTER" :y1="CENTER" :x2="x" :y2="y" class="radar__axis" />
      <polygon :points="shape" class="radar__shape" />
      <circle v-for="([x, y], i) in vertices" :key="`v-${i}`" :cx="x" :cy="y" r="3" class="radar__vertex" />
      <text v-for="label in labels" :key="label.dimension" :x="label.x" :y="label.y" :text-anchor="label.anchor" class="radar__label">
        <tspan v-for="(line, idx) in label.lines" :key="idx" :x="label.x" :dy="idx === 0 ? 0 : 13">{{ line }}</tspan>
        <tspan :x="label.x" dy="13" class="radar__value">{{ label.value }}%</tspan>
      </text>
    </svg>
  </figure>
</template>

<style scoped>
.radar {
  margin: 0;
  display: flex;
  justify-content: center;
}

.radar svg {
  width: 100%;
  max-width: 380px;
  height: auto;
  overflow: visible;
}

.radar__ring {
  fill: none;
  stroke: #cfcfcf;
  stroke-width: 1;
}

.radar__axis {
  stroke: #cfcfcf;
  stroke-width: 1;
}

.radar__shape {
  fill: rgba(10, 127, 122, 0.55);
  stroke: var(--np-primary);
  stroke-width: 1.5;
}

.radar__vertex {
  fill: var(--np-primary-dark);
}

.radar__label {
  font-family: var(--np-font-body);
  font-size: 10.5px;
  fill: #333;
}

.radar__value {
  font-weight: 700;
  fill: var(--np-primary);
}
</style>
