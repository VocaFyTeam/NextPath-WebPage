
const soles = amount => `S/ ${Number(amount).toLocaleString('en-US')}`;

export class Career {

    constructor({
                    id = null, name = '', emoji = '', area = '', imageUrl = '', shortDescription = '', description = '',
                    durationYears = 0, durationLabel = '', semesters = 0, modality = '', modalityDetail = '',
                    universities = [], fieldOfWork = [], mainField = '', skills = [],
                    averageSalary = { min: 0, max: 0 }, salaryRange = { min: 0, max: 0 },
                    employabilityRate = 0, demandLevel = '', baseCompatibility = 0, profile = {},
                    projection = [], recommendations = []
                } = {}) {
        this.id = id;
        this.name = name;
        this.emoji = emoji;
        this.area = area;
        this.imageUrl = imageUrl;
        this.shortDescription = shortDescription;
        this.description = description;
        this.durationYears = durationYears;
        this.durationLabel = durationLabel;
        this.semesters = semesters;
        this.modality = modality;
        this.modalityDetail = modalityDetail || modality;
        this.universities = universities;
        this.fieldOfWork = fieldOfWork;
        this.mainField = mainField;
        this.skills = skills;
        this.averageSalary = averageSalary;
        this.salaryRange = salaryRange;
        this.employabilityRate = employabilityRate;
        this.demandLevel = demandLevel;
        this.baseCompatibility = baseCompatibility;
        this.profile = profile;
        this.projection = projection;
        this.recommendations = recommendations;
    }

    get universityAcronyms() {
        return this.universities.map(university => university.acronym);
    }

    get averageSalaryLabel() {
        return `${soles(this.averageSalary.min)} - ${soles(this.averageSalary.max)}`;
    }

    get salaryRangeLabel() {
        return `${soles(this.salaryRange.min)} - ${soles(this.salaryRange.max)}`;
    }

    get durationText() {
        return this.durationLabel || `${this.durationYears} años`;
    }


    matchesQuery(query) {
        if (!query) return true;
        const normalize = text => (text ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        const haystack = normalize([this.name, this.area, this.shortDescription, this.mainField, ...this.fieldOfWork].join(' '));
        return normalize(query).split(/\s+/).every(word => haystack.includes(word));
    }

    static compatibilityLevel(value) {
        if (value >= 90) return 'excellent';
        if (value >= 80) return 'high';
        if (value >= 65) return 'medium';
        return 'low';
    }
}
