import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enAuth from '../locales/en/auth.json';
import enDashboard from '../locales/en/dashboard.json';
import enCommon from '../locales/en/common.json';
import enErrors from '../locales/en/errors.json';
import enTasks from '../locales/en/tasks.json';
import enQuiz from '../locales/en/quiz.json';
import enLibrary from '../locales/en/library.json';
import enMaterial from '../locales/en/material.json';
import enFolder from '../locales/en/folder.json';
import enFlashcard from '../locales/en/flashcard.json';
import enProgress from '../locales/en/progress.json';
import enLanding from '../locales/en/landing.json';
import enProfile from '../locales/en/profile.json';
import enProject from '../locales/en/project.json';
import enStreak from '../locales/en/streak.json';

import idAuth from '../locales/id/auth.json';
import idDashboard from '../locales/id/dashboard.json';
import idCommon from '../locales/id/common.json';
import idErrors from '../locales/id/errors.json';
import idTasks from '../locales/id/tasks.json';
import idQuiz from '../locales/id/quiz.json';
import idLibrary from '../locales/id/library.json';
import idMaterial from '../locales/id/material.json';
import idFolder from '../locales/id/folder.json';
import idFlashcard from '../locales/id/flashcard.json';
import idProgress from '../locales/id/progress.json';
import idLanding from '../locales/id/landing.json';
import idProfile from '../locales/id/profile.json';
import idProject from '../locales/id/project.json';
import idStreak from '../locales/id/streak.json';

const resources = {
  en: {
    auth: enAuth,
    dashboard: enDashboard,
    common: enCommon,
    errors: enErrors,
    tasks: enTasks,
    quiz: enQuiz,
    library: enLibrary,
    material: enMaterial,
    folder: enFolder,
    flashcard: enFlashcard,
    progress: enProgress,
    landing: enLanding,
    profile: enProfile,
    project: enProject,
    streak: enStreak,
  },
  id: {
    auth: idAuth,
    dashboard: idDashboard,
    common: idCommon,
    errors: idErrors,
    tasks: idTasks,
    quiz: idQuiz,
    library: idLibrary,
    material: idMaterial,
    folder: idFolder,
    flashcard: idFlashcard,
    progress: idProgress,
    landing: idLanding,
    profile: idProfile,
    project: idProject,
    streak: idStreak,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'id', // Default language Indonesia
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already escapes content
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
