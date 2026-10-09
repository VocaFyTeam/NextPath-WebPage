<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useCareerExplorationStore, MAX_COMPARISON } from '../../application/career-exploration.store.js';
import CareerCard from '../components/career-card.vue';

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const store = useCareerExplorationStore();
const loading = ref(!store.careersLoaded);

onMounted(async () => {
  await store.fetchCareers();
  loading.value = false;
});

function toggleComparison(careerId) {
  if (!store.toggleComparison(careerId)) {
    toast.add({ severity: 'warn', summary: t('careers.comparisonFull', { max: MAX_COMPARISON }), life: 3000 });
  }
}

function goToComparison() {
  if (store.selectedForComparison.length < 2) {
    toast.add({ severity: 'info', summary: t('careers.selectAtLeastTwo'), life: 3000 });
    return;
  }
  router.push({ name: 'career-comparison' });
}
</script>

<template>
  <div class="np-page explorer">
    <header class="explorer__header">
      <h1 class="np-page-title">{{ $t('careers.explorer') }}</h1>
      <button type="button" class="np-btn explorer__compare" @click="goToComparison">
        {{ $t('careers.compare') }}
        <span class="explorer__badge" v-if="store.selectedForComparison.length">{{ store.selectedForComparison.length }}</span>
        <i v-else class="pi pi-arrow-right-arrow-left" aria-hidden="true"></i>
      </button>
    </header>

    <form class="filters" role="search" @submit.prevent="store.applyFilters()">
      <label class="sr-only" for="career-search">{{ $t('careers.searchPlaceholder') }}</label>
      <div class="filters__search">
        <i class="pi pi-search" aria-hidden="true"></i>
        <input id="career-search" v-model="store.draftFilters.query" type="search" :placeholder="$t('careers.searchPlaceholder')" />
      </div>

      <div class="filters__row">
        <label class="filters__pill">
          <span class="sr-only">{{ $t('careers.filters.area') }}</span>
          <select v-model="store.draftFilters.area">
            <option :value="null">{{ $t('careers.filters.area') }}</option>
            <option v-for="area in store.areaOptions" :key="area" :value="area">{{ $t('careers.filters.area') }}({{ area }})</option>
          </select>
        </label>
        <label class="filters__pill">
          <span class="sr-only">{{ $t('careers.filters.duration') }}</span>
          <select v-model="store.draftFilters.duration">
            <option :value="null">{{ $t('careers.filters.duration') }}</option>
            <option v-for="years in store.durationOptions" :key="years" :value="years">{{ $t('careers.filters.duration') }} {{ $t('careers.years', { n: years }) }}</option>
          </select>
        </label>
        <label class="filters__pill">
          <span class="sr-only">{{ $t('careers.filters.modality') }}</span>
          <select v-model="store.draftFilters.modality">
            <option :value="null">{{ $t('careers.filters.modality') }}</option>
            <option v-for="modality in store.modalityOptions" :key="modality" :value="modality">{{ $t('careers.filters.modality') }} {{ modality.toLowerCase() }}</option>
          </select>
        </label>
        <label class="filters__pill">
          <span class="sr-only">{{ $t('careers.filters.university') }}</span>
          <select v-model="store.draftFilters.university">
            <option :value="null">{{ $t('careers.filters.university') }}</option>
            <option v-for="university in store.universityOptions" :key="university" :value="university">{{ $t('careers.filters.university') }} {{ university }}</option>
          </select>
        </label>

        <div class="filters__actions">
          <button type="button" class="filters__clear" @click="store.clearFilters()">{{ $t('careers.clearFilters') }}</button>
          <button type="submit" class="np-btn np-btn--sm filters__apply">{{ $t('careers.applyFilters') }}</button>
        </div>
      </div>
    </form>

    <section v-if="!loading && store.filteredCareers.length" class="explorer__grid" :aria-label="$t('careers.results')">
      <career-card
          v-for="career in store.filteredCareers"
          :key="career.id"
          :career="career"
          selectable
          :selected="store.isSelectedForComparison(career.id)"
          @toggle-select="toggleComparison"
      >
        <template #actions>
          <div class="explorer__card-actions">
            <router-link :to="{ name: 'career-detail', params: { id: career.id } }" class="np-btn np-btn--sm explorer__details">
              {{ $t('careers.viewDetails') }}
            </router-link>
          </div>
        </template>
      </career-card>
    </section>

    <section v-else-if="loading" class="explorer__grid">
      <div v-for="n in 3" :key="n" class="np-skeleton" style="height: 300px"></div>
    </section>

    <section v-else class="np-card np-empty">
      <i class="pi pi-filter-slash"></i>{{ $t('careers.noResults') }}
      <p><button type="button" class="np-btn np-btn--ghost np-btn--sm" @click="store.clearFilters()">{{ $t('careers.clearFilters') }}</button></p>
    </section>
  </div>
</template>

<style scoped>
.explorer {
  gap: 18px;
}

.explorer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.explorer__compare {
  border-radius: 6px;
  font-family: var(--np-font-body);
  font-weight: 500;
}

.explorer__badge {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: #fff;
  color: var(--np-primary);
  font-size: 11px;
  font-weight: 700;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--np-surface);
}

.filters__search {
  position: relative;
}

.filters__search i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  color: var(--np-muted);
}

.filters__search input {
  width: 100%;
  height: 36px;
  padding: 0 12px 0 34px;
  border: 1px solid var(--np-border);
  border-radius: 6px;
  font-size: 13px;
}

.filters__search input:focus {
  outline: 2px solid var(--np-primary-muted);
  border-color: var(--np-primary);
}

.filters__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.filters__pill select {
  appearance: none;
  height: 28px;
  padding: 0 28px 0 10px;
  border: 1px solid var(--np-border);
  border-radius: 4px;
  background: var(--np-surface-alt) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath d='M2 4l3-3 3 3M2 6l3 3 3-3' stroke='%23555' fill='none' stroke-width='1.2'/%3E%3C/svg%3E") no-repeat right 9px center;
  color: var(--np-ink);
  font-size: 11.5px;
  cursor: pointer;
}

.filters__pill select:focus {
  outline: 2px solid var(--np-primary-muted);
}

.filters__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.filters__clear {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--np-muted);
  font-size: 12px;
  cursor: pointer;
}

.filters__clear:hover {
  color: var(--np-primary);
  text-decoration: underline;
}

.filters__apply {
  background: #0d6e66;
  border-radius: 2px;
}

.explorer__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
}

.explorer__card-actions {
  display: flex;
  justify-content: center;
}

.explorer__details {
  min-width: 120px;
  border-radius: 6px;
  font-family: var(--np-font-body);
  font-weight: 500;
}

@media (max-width: 1100px) {
  .explorer__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .explorer__grid {
    grid-template-columns: 1fr;
  }

  .filters__actions {
    margin-left: 0;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
