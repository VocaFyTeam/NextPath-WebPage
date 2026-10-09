/**
 * Vocational material of the psychologist's library (guides, reading sheets...).
 *
 * @class VocationalResource
 */
export class VocationalResource {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?string} [params.id=null] - Resource identifier.
     * @param {string} [params.title=''] - Title.
     * @param {string} [params.category=''] - Category (Guía, Lectura recomendada...).
     * @param {string} [params.description=''] - Short description.
     * @param {string} [params.coverUrl=''] - Cover image.
     * @param {string} [params.fileUrl=''] - Downloadable file.
     * @param {string} [params.updatedAt=''] - ISO date of the last update.
     * @param {?string} [params.psychologistId=null] - Owner psychologist.
     */
    constructor({
        id = null, title = '', category = '', description = '', coverUrl = '', fileUrl = '', updatedAt = '', psychologistId = null
    } = {}) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.description = description;
        this.coverUrl = coverUrl;
        this.fileUrl = fileUrl;
        this.updatedAt = updatedAt;
        this.psychologistId = psychologistId;
    }

    /** @returns {string} Last update as dd/mm/yyyy. */
    get formattedUpdatedAt() {
        if (!this.updatedAt) return '';
        const [year, month, day] = this.updatedAt.split('-');
        return `${day}/${month}/${year}`;
    }

    /**
     * @param {string} query
     * @returns {boolean} Whether the resource matches the search text.
     */
    matches(query) {
        const normalize = text => (text ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        const haystack = normalize(`${this.title} ${this.category} ${this.description}`);
        return normalize(query).split(/\s+/).every(word => haystack.includes(word));
    }

    /** @returns {{resourceId: string, title: string, coverUrl: string, fileUrl: string}} Data attached to a chat message. */
    toAttachment() {
        return { resourceId: this.id, title: this.title, coverUrl: this.coverUrl, fileUrl: this.fileUrl };
    }
}
