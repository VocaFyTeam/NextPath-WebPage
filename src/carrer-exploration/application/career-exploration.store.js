
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { CareerExplorationApi } from '../infrastructure/career-exploration-api.js';
import { CareerAssembler } from '../infrastructure/career.assembler.js';
import { FavoriteCareerAssembler } from '../infrastructure/favorite-career.assembler.js';
import { FavoriteCareer } from '../domain/model/favorite-career.entity.js';

const careerApi = new CareerExplorationApi();
const COMPARISON_KEY = 'nextpath-comparison';
export const MAX_COMPARISON = 3;

const emptyFilters = () => ({ query: '', area: null, duration: null, modality: null, university: null });

function readComparison() {
    try {
        return JSON.parse(sessionStorage.getItem(COMPARISON_KEY) ?? '[]');
    } catch {
        return [];
    }
}

export const useCareerExplorationStore = defineStore('careerExploration', () => {

    const careers = ref([]);
    const favorites = ref([]);
    const careersLoaded = ref(false);
    const favoritesLoaded = ref(false);
    const errors = ref([]);

    const draftFilters = ref(emptyFilters());
    const appliedFilters = ref(emptyFilters());

    const selectedForComparison = ref(readComparison());
    watch(selectedForComparison, ids => sessionStorage.setItem(COMPARISON_KEY, JSON.stringify(ids)), { deep: true });

    // ----- Filter options (derived from the catalog) -----
    const unique = values => [...new Set(values)].sort((a, b) => String(a).localeCompare(String(b), 'es'));
    const areaOptions = computed(() => unique(careers.value.map(c => c.area)));
    const durationOptions = computed(() => unique(careers.value.map(c => c.durationYears)));
    const modalityOptions = computed(() => unique(careers.value.map(c => c.modality)));
    const universityOptions = computed(() => unique(careers.value.flatMap(c => c.universityAcronyms)));

    const filteredCareers = computed(() => {
        const f = appliedFilters.value;
        return careers.value.filter(career =>
            career.matchesQuery(f.query)
            && (!f.area || career.area === f.area)
            && (!f.duration || career.durationYears === f.duration)
            && (!f.modality || career.modality === f.modality)
            && (!f.university || career.universityAcronyms.includes(f.university)));
    });

    const favoriteCareers = computed(() =>
        favorites.value.map(fav => getCareerById(fav.careerId)).filter(Boolean));

    const comparisonCareers = computed(() =>
        selectedForComparison.value.map(id => getCareerById(id)).filter(Boolean));

    function getCareerById(id) {
        return careers.value.find(career => career.id === String(id)) ?? null;
    }

    function isFavorite(careerId) {
        return favorites.value.some(fav => fav.careerId === String(careerId));
    }

    function isSelectedForComparison(careerId) {
        return selectedForComparison.value.includes(String(careerId));
    }

    async function fetchCareers() {
        try {
            const response = await careerApi.getCareers();
            careers.value = CareerAssembler.toEntitiesFromResponse(response);
            careersLoaded.value = true;
        } catch (error) {
            errors.value.push(error);
        }
    }

    async function fetchFavorites(studentId) {
        try {
            const response = await careerApi.getFavoritesByStudentId(studentId);
            favorites.value = FavoriteCareerAssembler.toEntitiesFromResponse(response);
            favoritesLoaded.value = true;
        } catch (error) {
            errors.value.push(error);
        }
    }

    async function toggleFavorite(studentId, careerId) {
        const existing = favorites.value.find(fav => fav.careerId === String(careerId));
        try {
            if (existing) {
                await careerApi.deleteFavorite(existing.id);
                favorites.value = favorites.value.filter(fav => fav.id !== existing.id);
            } else {
                const entity = new FavoriteCareer({ studentId, careerId: String(careerId) });
                const response = await careerApi.createFavorite(FavoriteCareerAssembler.toResourceFromEntity(entity));
                favorites.value.push(FavoriteCareerAssembler.toEntityFromResource(response.data));
            }
        } catch (error) {
            errors.value.push(error);
        }
    }

    function toggleComparison(careerId) {
        const id = String(careerId);
        if (isSelectedForComparison(id)) {
            selectedForComparison.value = selectedForComparison.value.filter(selected => selected !== id);
            return true;
        }
        if (selectedForComparison.value.length >= MAX_COMPARISON) return false;
        selectedForComparison.value = [...selectedForComparison.value, id];
        return true;
    }

    function clearComparison() {
        selectedForComparison.value = [];
    }

    function applyFilters() {
        appliedFilters.value = { ...draftFilters.value };
    }

    function clearFilters() {
        draftFilters.value = emptyFilters();
        appliedFilters.value = emptyFilters();
    }

    return {
        careers, favorites, careersLoaded, favoritesLoaded, errors,
        draftFilters, appliedFilters, selectedForComparison,
        areaOptions, durationOptions, modalityOptions, universityOptions,
        filteredCareers, favoriteCareers, comparisonCareers,
        getCareerById, isFavorite, isSelectedForComparison,
        fetchCareers, fetchFavorites, toggleFavorite, toggleComparison, clearComparison, applyFilters, clearFilters
    };
});

export default useCareerExplorationStore;
