import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const usersEndpointPath = import.meta.env.VITE_USERS_ENDPOINT_PATH;


export class IamApi extends BaseApi {
    /** @type {BaseEndpoint} */
    #usersEndpoint;

    constructor() {
        super();
        this.#usersEndpoint = new BaseEndpoint(this, usersEndpointPath);
    }


    getUsersByEmail(email) {
        return this.#usersEndpoint.getAll({ email });
    }

    createUser(resource) {
        return this.#usersEndpoint.create(resource);
    }
}
