export const TRANSLATIONS = {
  ru: async () => ({
    ru: 'ru',
    template: '{{value}} {{nested.value}} {{array.0}} {{array.1.value}}'
  }),
  it: async () => ({
    it: 'it',
    template: '{{value}} {{nested.value}} {{array.0}} {{array.1.value}}'
  })
};

export const TRANSLATIONS_KEYS = Object.keys(TRANSLATIONS);

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

export const DEFAULT_PROPS = {
  language: TRANSLATIONS_KEYS[0],
  translations: TRANSLATIONS
};

export const SUSPENSE = 'suspense';

export const NOOP = () => {
  // Noop
};

export * as Module from '../src';
