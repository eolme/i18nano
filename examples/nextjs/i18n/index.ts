export const translations = {
  home: {
    en: () => import('./home/en.json'),
    it: () => import('./home/it.json')
  },
  readme: {
    en: () => import('./readme/en.json'),
    it: () => import('./readme/it.json')
  }
};

export const DEFAULT_LANGUAGE = 'en';
