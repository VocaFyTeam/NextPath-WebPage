import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const sessionsEndpointPath = import.meta.env.VITE_COUNSELING_SESSIONS_ENDPOINT_PATH;
const conversationsEndpointPath = import.meta.env.VITE_CONVERSATIONS_ENDPOINT_PATH;
const messagesEndpointPath = import.meta.env.VITE_MESSAGES_ENDPOINT_PATH;

/**
 * Infrastructure gateway for the Counseling bounded context
 * (orientation sessions and direct messages with psychologists).
 *
 * @class CounselingApi
 * @extends BaseApi
 */
export class CounselingApi extends BaseApi {
    #sessionsEndpoint;
    #conversationsEndpoint;
    #messagesEndpoint;

    constructor() {
        super();
        this.#sessionsEndpoint = new BaseEndpoint(this, sessionsEndpointPath);
        this.#conversationsEndpoint = new BaseEndpoint(this, conversationsEndpointPath);
        this.#messagesEndpoint = new BaseEndpoint(this, messagesEndpointPath);
    }

    // ----- Sessions -----
    /** @param {Object} [filters] @returns {Promise<import('axios').AxiosResponse>} */
    getSessions(filters = {}) {
        return this.#sessionsEndpoint.getAll(filters);
    }

    /** @param {Object} resource @returns {Promise<import('axios').AxiosResponse>} */
    createSession(resource) {
        return this.#sessionsEndpoint.create(resource);
    }

    /** @param {Object} resource @returns {Promise<import('axios').AxiosResponse>} */
    updateSession(resource) {
        return this.#sessionsEndpoint.update(resource.id, resource);
    }

    // ----- Messaging -----
    /** @param {string} studentId @returns {Promise<import('axios').AxiosResponse>} */
    getConversationsByStudentId(studentId) {
        return this.#conversationsEndpoint.getAll({ studentId });
    }

    /** @param {string} conversationId @returns {Promise<import('axios').AxiosResponse>} */
    getMessagesByConversationId(conversationId) {
        return this.#messagesEndpoint.getAll({ conversationId, _sort: 'sentAt', _order: 'asc' });
    }

    /** @param {Object} resource @returns {Promise<import('axios').AxiosResponse>} */
    createMessage(resource) {
        return this.#messagesEndpoint.create(resource);
    }
}
