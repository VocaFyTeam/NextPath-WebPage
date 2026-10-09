
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

    getCareers() {
        return this.#careersEndpoint.getAll();
    }

    getCareerById(id) {
        return this.#careersEndpoint.getById(id);
    }

    getFavoritesByStudentId(studentId) {
        return this.#favoritesEndpoint.getAll({ studentId });
    }

    createFavorite(resource) {
        return this.#favoritesEndpoint.create(resource);
    }

    deleteFavorite(id) {
        return this.#favoritesEndpoint.delete(id);
    }
}
