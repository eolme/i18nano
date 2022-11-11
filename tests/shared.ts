export const createTranslations = () => ({
  ru: async () => ({
    ru: 'ru',
    template: '{{value}} {{nested.value}} {{array.0}} {{array.1.value}} {{ru}} {{it}}'
  }),
  it: async () => ({
    it: 'it',
    template: '{{value}} {{nested.value}} {{array.0}} {{array.1.value}} {{ru}} {{it}}'
  })
});

export const TRANSLATIONS_KEYS = Object.keys(createTranslations());

export const VALUES = {
  value: '0',
  nested: {
    value: '1'
  },
  array: [
    '2',
    { value: '3' }
  ]
};

export const createDefaultProps = () => ({
  language: TRANSLATIONS_KEYS[0],
  preloadLanguage: false,
  preloadFallback: false,
  translations: createTranslations()
});

export const SUSPENSE = 'suspense';

export const NOOP = () => {
  // Noop
};

export * as Module from '../src/index.js';
export * as Lookup from '../src/lookup.js';
