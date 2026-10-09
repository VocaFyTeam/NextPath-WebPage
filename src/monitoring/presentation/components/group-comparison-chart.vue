<script setup>
import { AFFINITY_DIMENSIONS } from '../../../assessments/domain/model/affinity-profile.js';

/**
 * Horizontal grouped bar chart: one bar per group for each affinity dimension (mock-up 14).
 */
const props = defineProps({
  /** @type {Array<{id: string, name: string, shares: Object<string, number>}>} */
  series: { type: Array, required: true }
});

const COLORS = ['#0d4b40', '#0f8b84', '#6cc3bd', '#b7dfdc'];
/** The longest bar uses the full width; the rest are proportional. */
const max = () => Math.max(1, ...props.series.flatMap(serie => AFFINITY_DIMENSIONS.map(d => serie.shares[d] ?? 0)));
</script>

<template>
  <figure class="chart">
    <figcaption class="chart__legend">
      <span v-for="(serie, i) in series" :key="serie.id">
        <i :style="{ background: COLORS[i % COLORS.length] }" aria-hidden="true"></i>{{ serie.name }}
      </span>
    </figcaption>

    <div class="chart__rows">
      <div v-for="dimension in AFFINITY_DIMENSIONS" :key="dimension" class="chart__row">
        <span class="chart__label">{{ $t(`dimensions.${dimension}.short`) }}</span>
        <div class="chart__bars">
          <div v-for="(serie, i) in series" :key="serie.id" class="chart__bar-line">
            <div class="chart__bar" :style="{ width: `${((serie.shares[dimension] ?? 0) / max()) * 100}%`, background: COLORS[i % COLORS.length] }"
                 role="img" :aria-label="`${serie.name}, ${$t(`dimensions.${dimension}.short`)}: ${serie.shares[dimension] ?? 0}%`"></div>
            <span class="chart__value">{{ serie.shares[dimension] ?? 0 }} %</span>
          </div>
        </div>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.chart {
  position: relative;
  margin: 0;
}

.chart__legend {
  position: absolute;
  top: -34px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 10px;
}

.chart__legend span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.chart__legend i {
  width: 12px;
  height: 12px;
}

.chart__rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart__row {
  display: grid;
  grid-template-columns: 78px 1fr;
  align-items: start;
  gap: 8px;
}

.chart__label {
  padding-top: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--np-ink);
}

.chart__bars {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-right: 40px;
}

.chart__bar-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart__bar {
  height: 12px;
  min-width: 2px;
  max-width: 78%;
  transition: width 0.5s ease;
}

.chart__value {
  font-size: 9.5px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
