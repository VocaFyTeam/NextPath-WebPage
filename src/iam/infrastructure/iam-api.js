import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const usersEndpointPath = import.meta.env.VITE_USERS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for IAM bounded-context endpoints.
 *
 * @class IamApi
 * @extends BaseApi
 */
export class IamApi extends BaseApi {
    /** @type {BaseEndpoint} */
    #usersEndpoint;

    constructor() {
        super();
        this.#usersEndpoint = new BaseEndpoint(this, usersEndpointPath);
    }

    /**
     * Finds users by e-mail (json-server filter).
     * @param {string} email - E-mail to search.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getUsersByEmail(email) {
        return this.#usersEndpoint.getAll({ email });
    }

    /**
     * Creates a user resource.
     * @param {Object} resource - User resource.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    createUser(resource) {
        return this.#usersEndpoint.create(resource);
    }
}
