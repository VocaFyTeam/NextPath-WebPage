<script setup>
import { onMounted, ref } from 'vue';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useCareerExplorationStore } from '../../application/career-exploration.store.js';
import CareerCard from '../../presentation/components/career-card.vue';

const iamStore = useIamStore();
const store = useCareerExplorationStore();
const loading = ref(true);

onMounted(async () => {
  await Promise.all([store.careersLoaded ? null : store.fetchCareers(), store.fetchFavorites(iamStore.currentUser.id)]);
  loading.value = false;
});

function removeFavorite(careerId) {
  store.toggleFavorite(iamStore.currentUser.id, careerId);
}
</script>

<template>
  <div class="np-page favorites">
    <h1 class="np-page-title">{{ $t('favorites.title') }}</h1>

    <transition-group v-if="!loading && store.favoriteCareers.length" name="list" tag="section" class="favorites__grid">
      <career-card v-for="career in store.favoriteCareers" :key="career.id" :career="career">
        <template #actions>
          <div class="favorites__actions">
            <button type="button" class="favorites__remove" @click="removeFavorite(career.id)">
              <i class="pi pi-heart-fill" aria-hidden="true"></i>
              <span>{{ $t('favorites.removeShort') }}</span>
            </button>
            <router-link :to="{ name: 'career-detail', params: { id: career.id } }" class="np-btn favorites__details">
              {{ $t('careers.viewDetails') }}
            </router-link>
          </div>
        </template>
      </career-card>
    </transition-group>

    <section v-else-if="loading" class="favorites__grid">
      <div v-for="n in 3" :key="n" class="np-skeleton" style="height: 300px"></div>
    </section>

    <section v-else class="np-card np-empty">
      <i class="pi pi-heart"></i>{{ $t('favorites.empty') }}
      <p><router-link class="np-btn np-btn--sm" :to="{ name: 'career-list' }">{{ $t('dashboard.cards.goCareers') }}</router-link></p>
    </section>
  </div>
</template>

<style scoped>
.favorites {
  gap: 26px;
  padding-top: 14px;
}

.favorites__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 34px;
}

.favorites__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--np-border);
}

.favorites__remove {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 120px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--np-ink);
  font-size: 12px;
  text-align: center;
  line-height: 1.2;
  cursor: pointer;
}

.favorites__remove i {
  font-size: 20px;
  color: var(--np-primary-dark);
}

.favorites__remove:hover span {
  text-decoration: underline;
}

.favorites__details {
  border-radius: 6px;
  font-family: var(--np-font-heading),serif;
}

.list-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

@media (max-width: 1100px) {
  .favorites__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .favorites__grid {
    grid-template-columns: 1fr;
  }
}
</style>
