/**
 * Application service store for the Resources bounded context ("Biblioteca de recursos").
 *
 * @module useResourcesStore
 */
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { ResourcesApi } from '../infrastructure/resources-api.js';
import { VocationalResourceAssembler } from '../infrastructure/vocational-resource.assembler.js';

const resourcesApi = new ResourcesApi();

export const useResourcesStore = defineStore('resources', () => {
    /** @type {import('vue').Ref<import('../domain/model/vocational-resource.entity.js').VocationalResource[]>} */
    const resources = ref([]);
    const query = ref('');
    const loaded = ref(false);
    const errors = ref([]);

    const filteredResources = computed(() => resources.value.filter(resource => resource.matches(query.value)));

    /** @param {string} psychologistId */
    async function fetchResources(psychologistId) {
        try {
            const response = await resourcesApi.getResources(psychologistId);
            resources.value = VocationalResourceAssembler.toEntitiesFromResponse(response);
            loaded.value = true;
        } catch (error) {
            errors.value.push(error);
        }
    }

    return { resources, query, loaded, errors, filteredResources, fetchResources };
});

export default useResourcesStore;
