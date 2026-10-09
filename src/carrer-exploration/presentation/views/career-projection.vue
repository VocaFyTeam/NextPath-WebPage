<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useCareerExplorationStore } from '../../application/career-exploration.store.js';
import { useCareerCompatibility } from '../../application/use-career-compability.jsK';

const route = useRoute();
const store = useCareerExplorationStore();
const { ensureResults, compatibilityOf } = useCareerCompatibility();
const loading = ref(true);

onMounted(async () => {
  await Promise.all([store.careersLoaded ? null : store.fetchCareers(), ensureResults()]);
  loading.value = false;
});

const career = computed(() => store.getCareerById(route.params.id));
</script>

<template>
  <div class="np-page">
    <section v-if="career" class="np-panel projection">
      <header class="projection__header">
        <div>
          <h1 class="np-page-title projection__title">{{ $t('projection.title', { career: career.name }) }}</h1>
          <p class="np-page-subtitle">{{ $t('projection.subtitle') }}</p>
        </div>
        <p class="projection__compat">
          <strong>{{ compatibilityOf(career) }}%</strong> {{ $t('projection.compatibility') }}
        </p>
      </header>

      <section class="projection__box">
        <h2 class="projection__box-title">{{ $t('projection.timeline') }}</h2>
        <ol class="timeline">
          <li v-for="stage in career.projection" :key="stage.period" class="timeline__stage">
            <span class="timeline__period">{{ stage.period }}</span>
            <strong class="timeline__role">{{ stage.role }}</strong>
            <span class="timeline__salary">{{ $t('projection.estimatedSalary') }}<br />{{ stage.salary }}</span>
          </li>
        </ol>
      </section>

      <section class="projection__box">
        <h2 class="projection__box-title projection__box-title--teal">{{ $t('projection.recommendations') }}</h2>
        <ul class="recommendations">
          <li v-for="recommendation in career.recommendations" :key="recommendation">{{ recommendation }}</li>
        </ul>
      </section>

      <footer class="projection__actions">
        <router-link :to="{ name: 'career-detail', params: { id: career.id } }" class="np-btn projection__back">
          <i class="pi pi-angle-left" aria-hidden="true"></i> {{ $t('common.back') }}
        </router-link>
      </footer>
    </section>

    <div v-else-if="loading" class="np-skeleton" style="height: 420px"></div>

    <section v-else class="np-card np-empty">
      <i class="pi pi-exclamation-circle"></i>{{ $t('careerDetail.notFound') }}
    </section>
  </div>
</template>

<style scoped>
.projection {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 22px 28px 26px;
}

.projection__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.projection__title {
  font-size: 26px;
}

.projection__compat {
  max-width: 160px;
  margin: 0;
  color: var(--np-primary);
  font-family: var(--np-font-heading);
  font-size: 13px;
  font-weight: 600;
  text-align: right;
}

.projection__compat strong {
  font-size: 15px;
}

.projection__box {
  padding: 16px 22px 20px;
  border: 1px solid var(--np-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.projection__box-title {
  margin: 0 0 16px;
  font-family: var(--np-font-heading);
  font-size: 15px;
  font-weight: 700;
  color: var(--np-ink);
  text-transform: uppercase;
}

.projection__box-title--teal {
  color: var(--np-primary);
}

.timeline {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.timeline__stage {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px 14px;
  border: 1px solid var(--np-border);
  background: var(--np-surface-alt);
}

.timeline__period {
  color: var(--np-primary);
  font-family: var(--np-font-heading);
  font-size: 13px;
  font-weight: 600;
}

.timeline__role {
  font-family: var(--np-font-heading);
  font-size: 13.5px;
  color: var(--np-ink);
}

.timeline__salary {
  font-size: 12px;
  color: var(--np-muted);
}

.recommendations {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.recommendations li {
  position: relative;
  padding: 8px 12px 8px 26px;
  background: var(--np-surface-alt);
  font-size: 12.5px;
}

.recommendations li::before {
  content: '';
  position: absolute;
  left: 12px;
  top: 50%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--np-primary);
  transform: translateY(-50%);
}

.projection__back {
  border-radius: 0;
  font-family: var(--np-font-body);
  font-weight: 500;
}

@media (max-width: 1000px) {
  .timeline {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .projection {
    padding: 18px 16px;
  }

  .projection__header {
    flex-direction: column;
  }

  .projection__compat {
    text-align: left;
    max-width: none;
  }

  .timeline {
    grid-template-columns: 1fr;
  }
}
</style>
