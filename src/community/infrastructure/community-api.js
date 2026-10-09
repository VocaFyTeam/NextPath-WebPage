import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";
import {BaseApi} from "../../shared/infrastructure/base-api.js";

const communitiesEndpointPath = import.meta.env.VITE_COMMUNITIES_ENDPOINT_PATH;
const threadsEndpointPath = import.meta.env.VITE_THREADS_ENDPOINT_PATH;
const commentsEndpointPath = import.meta.env.VITE_COMMENTS_ENDPOINT_PATH;

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

    getCommunities() {
        return this.#communitiesEndpoint.getAll();
    }
    getThreads() {
        return this.#threadsEndpoint.getAll({ _sort: 'createdAt', _order: 'desc' });
    }

    patchThread(id, changes) {
        return this.#threadsEndpoint.patch(id, changes);
    }

    getCommentsByThreadId(threadId) {
        return this.#commentsEndpoint.getAll({ threadId, _sort: 'createdAt', _order: 'asc' });
    }

    createComment(resource) {
        return this.#commentsEndpoint.create(resource);
    }
}
