import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const communitiesEndpointPath = import.meta.env.VITE_COMMUNITIES_ENDPOINT_PATH;
const threadsEndpointPath = import.meta.env.VITE_THREADS_ENDPOINT_PATH;
const commentsEndpointPath = import.meta.env.VITE_COMMENTS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for the Community bounded context.
 *
 * @class CommunityApi
 * @extends BaseApi
 */
export class CommunityApi extends BaseApi {
    #communitiesEndpoint;
    #threadsEndpoint;
    #commentsEndpoint;

    constructor() {
        super();
        this.#communitiesEndpoint = new BaseEndpoint(this, communitiesEndpointPath);
        this.#threadsEndpoint = new BaseEndpoint(this, threadsEndpointPath);
        this.#commentsEndpoint = new BaseEndpoint(this, commentsEndpointPath);
    }

    /** @returns {Promise<import('axios').AxiosResponse>} */
    getCommunities() {
        return this.#communitiesEndpoint.getAll();
    }

    /** @returns {Promise<import('axios').AxiosResponse>} Threads, most recent first. */
    getThreads() {
        return this.#threadsEndpoint.getAll({ _sort: 'createdAt', _order: 'desc' });
    }

    /** @param {string} id @param {Object} changes @returns {Promise<import('axios').AxiosResponse>} */
    patchThread(id, changes) {
        return this.#threadsEndpoint.patch(id, changes);
    }

    /** @param {string} threadId @returns {Promise<import('axios').AxiosResponse>} */
    getCommentsByThreadId(threadId) {
        return this.#commentsEndpoint.getAll({ threadId, _sort: 'createdAt', _order: 'asc' });
    }

    /** @param {Object} resource @returns {Promise<import('axios').AxiosResponse>} */
    createComment(resource) {
        return this.#commentsEndpoint.create(resource);
    }
}