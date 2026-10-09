
import {BaseApi} from '../../shared/infrastructure/base-api.js'
import {BaseEndpoint} from '../../shared/infrastructure/base-endpoint.js'

const careersEndpointPath = import.meta.env.VITE_CAREERS_ENDPOINT_PATH;
const favoritesEndpointPath = import.meta.env.VITE_FAVORITES_ENDPOINT_PATH;
export class CareerExplorationApi extends BaseApi {
    #careersEndpoint;
    #favoritesEndpoint;

    constructor() {
        super();
        this.#careersEndpoint = new BaseEndpoint(this, careersEndpointPath);
        this.#favoritesEndpoint = new BaseEndpoint(this, favoritesEndpointPath);
    }

    /** @returns {Promise<import('axios').AxiosResponse>} All careers. */
    getCareers() {
        return this.#careersEndpoint.getAll();
    }

    /** @param {string} id @returns {Promise<import('axios').AxiosResponse>} One career. */
    getCareerById(id) {
        return this.#careersEndpoint.getById(id);
    }

    /** @param {string} studentId @returns {Promise<import('axios').AxiosResponse>} Favorites of a student. */
    getFavoritesByStudentId(studentId) {
        return this.#favoritesEndpoint.getAll({ studentId });
    }

    /** @param {Object} resource @returns {Promise<import('axios').AxiosResponse>} */
    createFavorite(resource) {
        return this.#favoritesEndpoint.create(resource);
    }

    /** @param {string} id @returns {Promise<import('axios').AxiosResponse>} */
    deleteFavorite(id) {
        return this.#favoritesEndpoint.delete(id);
    }
}
