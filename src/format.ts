import type { FCC } from './compat.js';

import * as React from 'react';

import { useTranslationChange } from './react.js';

type IntlConstructor<T> = new (lang: string, options: Record<never, never>) => T;

type IntlFormat =
  Intl.NumberFormat |
  Intl.DateTimeFormat |
  Intl.RelativeTimeFormat |
  Intl.ListFormat |
  Intl.PluralRules;

type IntlFormatOptions =
  Intl.NumberFormatOptions |
  Intl.DateTimeFormatOptions |
  Intl.RelativeTimeFormatOptions |
  Intl.ListFormatOptions |
  Intl.PluralRulesOptions;

const createCache = () => new Map<IntlFormatOptions, IntlFormat>();

const FormatContext = React.createContext({
  lang: '',
  cache: createCache()
});

const useFormat = <T extends IntlFormat>(constructor: IntlConstructor<T>, options: IntlFormatOptions) => {
  const context = React.useContext(FormatContext);

  let cached = context.cache.get(options);

  if (typeof cached === 'undefined') {
    cached = new constructor(context.lang, options);
    context.cache.set(options, cached);
  }

  return cached as T;
};

export const useFormatNumber = (options: Intl.NumberFormatOptions) => {
  return useFormat(Intl.NumberFormat, options);
};

export const useFormatDate = (options: Intl.DateTimeFormatOptions) => {
  return useFormat(Intl.DateTimeFormat, options);
};

export const useFormatRelative = (options: Intl.RelativeTimeFormatOptions) => {
  return useFormat(Intl.RelativeTimeFormat, options);
};

export const useFormatList = (options: Intl.ListFormatOptions) => {
  return useFormat(Intl.ListFormat, options);
};

export const useFormatPlural = (options: Intl.PluralRulesOptions) => {
  return useFormat(Intl.PluralRules, options);
};

export const FormatProvider: FCC = ({ children }) => {
  const translation = useTranslationChange();

  const context = React.useMemo(() => ({
    lang: translation.lang,
    cache: createCache()
  }), [translation.lang]);

  const FormatContextProps = {
    value: context
  } as const;

  return React.createElement(
    FormatContext.Provider,
    FormatContextProps,
    children
  );
};
