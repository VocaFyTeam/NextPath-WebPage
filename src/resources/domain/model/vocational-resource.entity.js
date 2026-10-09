import { assetPath, assetUrl } from '../../../shared/infrastructure/asset-url.js';


export class VocationalResource {

    constructor({
                    id = null, title = '', category = '', description = '', coverUrl = '', fileUrl = '', updatedAt = '', psychologistId = null
                } = {}) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.description = description;
        this.coverUrl = assetUrl(coverUrl);
        this.fileUrl = assetUrl(fileUrl);
        this.updatedAt = updatedAt;
        this.psychologistId = psychologistId;
    }

    get formattedUpdatedAt() {
        if (!this.updatedAt) return '';
        const [year, month, day] = this.updatedAt.split('-');
        return `${day}/${month}/${year}`;
    }


    matches(query) {
        const normalize = text => (text ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        const haystack = normalize(`${this.title} ${this.category} ${this.description}`);
        return normalize(query).split(/\s+/).every(word => haystack.includes(word));
    }

    toAttachment() {
        // Stored without the base path so it works both locally and in GitHub Pages.
        return { resourceId: this.id, title: this.title, coverUrl: assetPath(this.coverUrl), fileUrl: assetPath(this.fileUrl) };
    }
}
