<script setup>
import {computed, onMounted, ref} from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Card from 'primevue/card'
import Button from 'primevue/button'

import {
  useCareerExplorationStore
} from '../../application/career-exploration.store'
import {useIamStore} from "../../../iam/application/iam.store.js";

const route = useRoute()
const iamStore = useIamStore();
const store = useCareerExplorationStore();
const loading = ref(!store.careersLoaded)

onMounted(async() => {
  await Promise.all ([
    store.careersLoaded ? null : store.fetchCareers(),
    store.favoritesLoaded ? null : store.fetchFavorites(iamStore)
  ]);
  loading.value = false;
});


const career = computed(() => store.getCareerById(route.params.id));
const isFavorite = computed(() => (career.value ? store.isFavorite(career.value.id) : false));

function toggleFavorite() {
  store.toggleFavorite(iamStore.currentUser.id, career.value.id);
}
</script>

<template>
  <div class="np-page detail">
    <template v-if="career">
      <header class="detail__header">
        <h1 class="np-page-title detail__title">
          {{ career.name }}
          <button type="button" class="detail__fav" :class="{ 'is-active': isFavorite }" :aria-pressed="isFavorite"
                  :aria-label="$t(isFavorite ? 'favorites.remove' : 'favorites.add')"
                  v-tooltip.bottom="$t(isFavorite ? 'favorites.remove' : 'favorites.add')"
                  @click="toggleFavorite">
            <i :class="isFavorite ? 'pi pi-heart-fill' : 'pi pi-heart'" aria-hidden="true"></i>
          </button>
        </h1>
        <router-link :to="{ name: 'career-projection', params: { id: career.id } }" class="np-btn detail__simulate">
          <i class="pi pi-chart-line" aria-hidden="true"></i> {{ $t('careerDetail.simulate') }}
        </router-link>
      </header>

      <section class="detail__main">
        <img :src="career.imageUrl" :alt="career.name" class="detail__image" />
        <div class="detail__info">
          <h2><span aria-hidden="true">{{ career.emoji }}</span> {{ career.name }}:</h2>
          <p>{{ career.description }}</p>

          <h3><span aria-hidden="true">&#x1F3DB;&#xFE0F;</span> {{ $t('careerDetail.universities') }}</h3>
          <ul><li v-for="university in career.universities" :key="university.acronym">{{ university.name }}</li></ul>

          <h3><span aria-hidden="true">&#x23F1;&#xFE0F;</span> {{ $t('careerDetail.duration') }} <span class="detail__inline">{{ career.durationText }}</span></h3>

          <h3><span aria-hidden="true">&#x1F4BC;</span> {{ $t('careerDetail.fieldOfWork') }}</h3>
          <ul><li v-for="field in career.fieldOfWork" :key="field">{{ field }}</li></ul>
        </div>
      </section>

      <section class="detail__bottom">
        <article class="detail__card">
          <h2>{{ $t('careerDetail.studyPlan') }}</h2>
          <p>{{ $t('careerDetail.studyPlanHint') }}</p>
          <div class="detail__plans">
            <a v-for="university in career.universities" :key="university.acronym" :href="university.studyPlanUrl"
               target="_blank" rel="noopener noreferrer" class="np-btn detail__plan"
               :aria-label="$t('careerDetail.openPlan', { university: university.name })">
              {{ university.acronym }}
            </a>
          </div>
        </article>

        <article class="detail__card detail__card--skills">
          <h2>{{ $t('careerDetail.skills') }}</h2>
          <ul><li v-for="skill in career.skills" :key="skill">{{ skill }}</li></ul>
          <p class="detail__salary">{{ $t('careerDetail.averageSalary') }} {{ career.averageSalaryLabel }}</p>
        </article>
      </section>
    </template>

    <template v-else-if="loading">
      <div class="np-skeleton" style="height: 40px; width: 40%"></div>
      <div class="np-skeleton" style="height: 320px"></div>
    </template>

    <section v-else class="np-card np-empty">
      <i class="pi pi-exclamation-circle"></i>{{ $t('careerDetail.notFound') }}
      <p><router-link class="np-link" :to="{ name: 'career-list' }">{{ $t('careerDetail.backToExplorer') }}</router-link></p>
    </section>
  </div>
</template>

<style scoped>
.detail {
  gap: 18px;
}

.detail__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
}

.detail__title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.detail__fav {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--np-primary);
  cursor: pointer;
}

.detail__fav i {
  font-size: 24px;
}

.detail__fav:hover {
  background: rgba(10, 127, 122, 0.1);
}

.detail__simulate {
  border-radius: 6px;
  font-family: var(--np-font-body);
  font-weight: 500;
}

.detail__main {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: 22px;
  padding: 16px;
  border-radius: 8px;
  background: var(--np-surface);
}

.detail__image {
  width: 100%;
  height: 100%;
  min-height: 260px;
  max-height: 340px;
  object-fit: cover;
  border-radius: 6px;
}

.detail__info {
  font-size: 13.5px;
  line-height: 1.4;
}

.detail__info h2 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
}

.detail__info h3 {
  margin: 12px 0 0;
  font-family: var(--np-font-body);
  font-size: 13.5px;
  font-weight: 700;
  color: var(--np-ink);
}

.detail__info p {
  margin: 2px 0 0;
}

.detail__info ul,
.detail__card ul {
  margin: 2px 0 0;
  padding-left: 0;
  list-style: none;
}

.detail__info li::before,
.detail__card li::before {
  content: '- ';
}

.detail__inline {
  font-weight: 400;
}

.detail__bottom {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.detail__card {
  padding: 16px 20px;
  border-radius: 8px;
  background: var(--np-surface);
  font-size: 13.5px;
}

.detail__card h2 {
  margin: 0 0 4px;
  color: var(--np-primary);
  font-size: 16px;
  font-weight: 600;
}

.detail__card p {
  margin: 0;
}

.detail__plans {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 14px;
}

.detail__plan {
  min-width: 90px;
  border-radius: 4px;
  background: #0d6e66;
  font-family: var(--np-font-body);
  font-weight: 500;
}

.detail__card--skills li::before {
  content: '- ';
}

.detail__salary {
  margin-top: 12px !important;
  color: var(--np-primary);
  font-weight: 600;
}

@media (max-width: 900px) {
  .detail__main,
  .detail__bottom {
    grid-template-columns: 1fr;
  }
}
</style>
