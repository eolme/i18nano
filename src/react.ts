import type { ComponentType, FC } from 'react';
import type {
  TranslationChange,
  TranslationChangeProps,
  TranslationFunction,
  TranslationFunctionProps,
  TranslationProps,
  TranslationValues
} from './types.js';

import React from 'react';

import { suspend, preload as suspendPreload } from 'suspend-react';

import { default as get } from 'get-value';

const {
  unstable_startTransition = (scope: () => void) => scope(),
  startTransition = unstable_startTransition
} = React as any;

const EMPTY = '';

const GET_OPTIONS = {
  default: EMPTY
};

const getTranslation = (path: string, values: TranslationValues): string => get(values, path, GET_OPTIONS);

const lookup = (path: string, values: TranslationValues, lang: TranslationValues) => {
  let resolved = getTranslation(path, lang);

  for (const key in values) {
    resolved = resolved.replace(`{{${key}}}`, getTranslation(key, values));
  }

  return resolved;
};

const noop = () => {
  // Noop
};

const TranslationContext = React.createContext<TranslationFunction>(() => EMPTY);
const TranslationChangeContext = React.createContext<TranslationChange>({
  lang: '',
  preload: noop,
  change: noop
});

type TranslationProviderProps = {
  language?: string;
  fallback?: string;
  translations?: Record<string, () => Promise<TranslationValues>>;
};

export const TranslationProvider: FC<TranslationProviderProps> = ({
  language = 'en',
  fallback = language,
  translations = {},
  children
}) => {
  const [lang, setLanguage] = React.useState(language);

  const preload = (next: string) => {
    suspendPreload(translations[next], [next]);
  };

  if (language !== lang) {
    preload(lang);
  }

  if (language !== fallback) {
    preload(fallback);
  }

  const change = (next: string) => {
    startTransition(() => {
      setLanguage(next);
    });
  };

  const t = React.useCallback((path: string, values: TranslationValues = {}) => {
    let result = EMPTY;

    if (lang in translations) {
      result = lookup(path, values, suspend(translations[lang], [lang]));
    }

    if (result === EMPTY && lang !== fallback && fallback in translations) {
      result = lookup(path, values, suspend(translations[fallback], [fallback]));
    }

    return result;
  }, [lang]);

  const translation = React.useMemo(() => ({
    lang,
    change,
    preload
  }), [lang]);

  const TranslationContextProps = {
    value: t
  } as const;

  const TranslationChangeContextProps = {
    value: translation
  } as const;

  return React.createElement(
    TranslationChangeContext.Provider,
    TranslationChangeContextProps,
    React.createElement(
      TranslationContext.Provider,
      TranslationContextProps,
      children
    )
  );
};

export const useTranslation = () => {
  return React.useContext(TranslationContext);
};

export const useTranslationChange = () => {
  return React.useContext(TranslationChangeContext);
};

export const withTranslation = <P>(Component: ComponentType<P & TranslationFunctionProps>) => {
  const WithTranslation: FC<P> = (props) => {
    const t = useTranslation();

    return React.createElement(Component, Object.assign({}, props, { t }));
  };

  return WithTranslation;
};

export const withTranslationChange = <P>(Component: ComponentType<P & TranslationChangeProps>) => {
  const WithTranslationChange: FC<P> = (props) => {
    const translation = useTranslationChange();

    return React.createElement(Component, Object.assign({}, props, { translation }));
  };

  return WithTranslationChange;
};

const TranslationRender: FC<TranslationProps> = ({ path, values }) => {
  const t = useTranslation();

  return t(path, values) as any;
};

export const Translation: FC<TranslationProps> = ({
  children = null,
  path,
  values
}) => {
  return React.createElement(
    React.Suspense,
    // eslint-disable-next-line react/destructuring-assignment
    { fallback: children },
    React.createElement(
      TranslationRender,
      { path, values }
    )
  );
};
