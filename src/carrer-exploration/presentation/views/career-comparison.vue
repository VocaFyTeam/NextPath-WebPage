<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCareerExplorationStore } from '../../application/career-exploration.store.js';
import { useCareerCompatibility } from '../../application/use-career-compability.js';

const { t } = useI18n();
const store = useCareerExplorationStore();
const { ensureResults, compatibilityOf, levelOf } = useCareerCompatibility();
const loading = ref(true);

onMounted(async () => {
  await Promise.all([store.careersLoaded ? null : store.fetchCareers(), ensureResults()]);
  loading.value = false;
});

const careers = computed(() => store.comparisonCareers);

/** Rows of the comparison table (criterion + how to read each career). */
const rows = computed(() => [
  { key: 'compatibility', highlight: true,
    value: c => `${compatibilityOf(c)}% (${t(`comparison.levels.${levelOf(c)}`)})` },
  { key: 'duration', value: c => t('comparison.durationValue', { years: c.durationYears, semesters: c.semesters }) },
  { key: 'salary', value: c => c.salaryRangeLabel },
  { key: 'employability', value: c => `${c.employabilityRate}% (${t('comparison.demand', { level: c.demandLevel })})` },
  { key: 'universities', value: c => c.universityAcronyms.join(', ') },
  { key: 'field', value: c => c.mainField },
  { key: 'modality', value: c => c.modalityDetail }
]);
</script>

<template>
  <div class="np-page">
    <section class="np-panel comparison">
      <header>
        <h1 class="np-page-title comparison__title">{{ $t('comparison.title') }}</h1>
        <p class="np-page-subtitle">{{ $t('comparison.subtitle') }}</p>
      </header>

      <div v-if="!loading && careers.length" class="comparison__scroll">
        <table class="comparison__table">
          <caption class="sr-only">{{ $t('comparison.title') }}</caption>
          <thead>
          <tr>
            <th scope="col">{{ $t('comparison.criterion') }}</th>
            <th v-for="career in careers" :key="career.id" scope="col">
              <span>{{ career.name }}</span>
              <button type="button" class="comparison__remove" :aria-label="$t('careers.removeFromComparison', { name: career.name })"
                      @click="store.toggleComparison(career.id)">
                <i class="pi pi-times" aria-hidden="true"></i>
              </button>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="row in rows" :key="row.key">
            <th scope="row">{{ $t(`comparison.rows.${row.key}`) }}</th>
            <td v-for="career in careers" :key="career.id" :class="{ 'is-highlight': row.highlight }">
              {{ row.value(career) }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="loading" class="np-skeleton" style="height: 260px"></div>

      <div v-else class="np-empty">
        <i class="pi pi-arrow-right-arrow-left"></i>{{ $t('comparison.empty') }}
      </div>

      <footer>
        <router-link :to="{ name: 'career-list' }" class="np-btn comparison__back">
          <i class="pi pi-angle-left" aria-hidden="true"></i> {{ $t('common.back') }}
        </router-link>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.comparison {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: calc(100vh - var(--np-topbar-height) - 70px);
  padding: 26px 28px;
}

.comparison__title {
  font-size: 26px;
}

.comparison__scroll {
  overflow-x: auto;
}

.comparison__table {
  width: 100%;
  min-width: 620px;
  border-collapse: collapse;
  font-size: 12.5px;
}

.comparison__table thead th {
  position: relative;
  padding: 10px 12px;
  background: #0f5f57;
  color: #fff;
  font-family: var(--np-font-heading);
  font-weight: 600;
  text-align: left;
}

.comparison__remove {
  margin-left: 8px;
  padding: 2px 4px;
  border: 0;
  border-radius: 3px;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  vertical-align: middle;
}

.comparison__remove:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
}

.comparison__remove i {
  font-size: 10px;
}

.comparison__table tbody th,
.comparison__table tbody td {
  padding: 11px 12px;
  border-bottom: 1px solid #e3e3e3;
  text-align: left;
  vertical-align: top;
}

.comparison__table tbody th {
  width: 26%;
  font-weight: 700;
  color: var(--np-ink);
}

.comparison__table tbody tr:nth-child(odd) {
  background: #f7f7f7;
}

.comparison__table td.is-highlight {
  color: var(--np-primary);
  font-weight: 700;
}

.comparison__back {
  border-radius: 0;
  font-family: var(--np-font-body);
  font-weight: 500;
}
</style>
