import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Languages that should render RTL
const RTL_LANGS = new Set(['ar', 'he', 'fa', 'ur']);

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      // order and from where user language should be detected
      order: ['localStorage', 'navigator', 'htmlTag', 'querystring'],
      caches: ['localStorage'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // Show keys if missing translations during dev
    saveMissing: false,
    debug: false,
  });

// Hook: sync document direction with language
function applyDirForLanguage(lng) {
  const dir = RTL_LANGS.has(lng.split('-')[0]) ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
}

// Initialize dir on load
applyDirForLanguage(i18n.language || 'en');

// Update dir on language change
i18n.on('languageChanged', (lng) => {
  applyDirForLanguage(lng);
});

export default i18n;
