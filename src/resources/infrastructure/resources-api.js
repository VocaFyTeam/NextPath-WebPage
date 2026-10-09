import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const resourcesEndpointPath = import.meta.env.VITE_RESOURCES_ENDPOINT_PATH;

/**
 * Infrastructure gateway for the Resources bounded context (vocational library).
 *
 * @class ResourcesApi
 * @extends BaseApi
 */
export class ResourcesApi extends BaseApi {
    #resourcesEndpoint;

    constructor() {
        super();
        this.#resourcesEndpoint = new BaseEndpoint(this, resourcesEndpointPath);
    }

    /** @param {string} psychologistId @returns {Promise<import('axios').AxiosResponse>} */
    getResources(psychologistId) {
        return this.#resourcesEndpoint.getAll({ psychologistId });
    }
}
