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

export const TRANSLATIONS_KEYS = Object.keys(TRANSLATIONS) as ['ru', 'it'];

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

export const DATE = {
  value: new Date(2022, 4, 7, 4, 20, 13, 37),
  options: {
    date: {
      day: 'numeric',
      month: 'numeric',
      year: '2-digit'
    },
    time: {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    },
    datetime: {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',

      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    }
  },
  ru: {
    date: '07.05.22',
    time: '04:20:13',
    datetime: '07.05.2022, 04:20:13'
  },
  it: {
    date: '7/5/22',
    time: '04:20:13',
    datetime: '7/5/2022, 04:20:13'
  }
};

export const NUMBER = {
  value: 1_337_420.42,
  options: {
    style: 'currency',
    currency: 'USD',
    signDisplay: 'always',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  },
  ru: '+1\u00A0337\u00A0420,4200\u00A0$',
  it: '+1.337.420,4200\u00A0USD'
};

export const RELATIVE = {
  value: 0.5,
  unit: 'days',
  options: {
    style: 'long',
    numeric: 'always'
  },
  ru: 'через 0,5 дня',
  it: 'tra 0,5 giorni'
};

export const LIST = {
  value: [1, 2, 3].map(String),
  options: {
    style: 'long'
  },
  ru: '1, 2 и 3',
  it: '1, 2 e 3'
};

export const PLURAL = {
  value: 3,
  options: {},
  ru: 'few',
  it: 'other'
};

export const DEFAULT_PROPS = {
  language: TRANSLATIONS_KEYS[0],
  translations: TRANSLATIONS
};

export const SUSPENSE = 'suspense';

export const NOOP = () => {
  // Noop
};

// eslint-disable-next-line no-restricted-syntax
export * as Module from '../src';

// eslint-disable-next-line no-restricted-syntax
export * as ModuleFormat from '../src/format';
