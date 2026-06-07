import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './src/locales/en.json';
import id from './src/locales/id.json';

const resources = {
  en: { translation: en },
  id: { translation: id },
};

const detectedLanguage = getLocales()[0]?.languageCode ?? 'en';

// Android tertentu masih mengembalikan "in" untuk Bahasa Indonesia
const language = detectedLanguage === 'in' ? 'id' : detectedLanguage;

console.log('Detected language:', detectedLanguage);
console.log('Using language:', language);

i18n.use(initReactI18next).init({
  resources,
  lng: language,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;