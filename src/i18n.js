import en from './locales/en.json';
import es from './locales/es.json';
import { createI18n } from 'vue-i18n';

const LOCALE_KEY = 'nextpath-locale';

/** @returns {string} Saved locale or Spanish (language of the mockups). */
function initialLocale() {
    try {
        return localStorage.getItem(LOCALE_KEY) || 'es';
    } catch {
        return 'es';
    }
}

const i18n = createI18n({
    legacy: false,
    locale: initialLocale(),
    fallbackLocale: 'es',
    messages: { en, es }
});

/**
 * Changes and persists the UI language.
 * @param {'es'|'en'} locale
 */
export function setLocale(locale) {
    i18n.global.locale.value = locale;
    document.documentElement.lang = locale;
    try {
        localStorage.setItem(LOCALE_KEY, locale);
    } catch { /* storage not available */ }
}

export default i18n;
