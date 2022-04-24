import type { ComponentType, FC } from 'react';
import type {
  TranslationChange,
  TranslationChangeProps,
  TranslationFunction,
  TranslationFunctionProps,
  TranslationProps,
  TranslationProviderProps,
  TranslationValues
} from './types.js';

import React from 'react';

import { suspend, preload as suspendPreload } from 'suspend-react';

import { default as get } from 'get-value';

const noop = () => {
  // Noop
};

const invoke = (scope: () => void) => {
  scope();
};

/**
 * React 18+ concurrent feature
 */
const {
  unstable_startTransition = invoke,
  startTransition = unstable_startTransition
} = React as unknown as {
  unstable_startTransition: typeof invoke;
  startTransition: typeof invoke;
};

const EMPTY = '';

const GET_OPTIONS = {
  default: EMPTY
} as const;

const PREFIX = '$$';
const keyed = (key: string) => [PREFIX + key];

/**
 * @param path - property path like 'a.b.c'
 * @param values - object
 * @returns string of values if found otherwise empty string
 *
 * @see https://npm.im/get-value
 */
const lookupValue = (path: string, values: TranslationValues): string => {
  return get(values, path, GET_OPTIONS);
};

const lookup = (path: string, values: TranslationValues, lang: TranslationValues) => {
  let resolved = lookupValue(path, lang);

  for (const key in values) {
    resolved = resolved.replace(`{{${key}}}`, lookupValue(key, values));
  }

  return resolved;
};

const TranslationContext = React.createContext<TranslationFunction>(() => EMPTY);
const TranslationChangeContext = React.createContext<TranslationChange>({
  all: [],
  lang: '',
  change: noop,
  preload: noop
});

export const TranslationProvider: FC<TranslationProviderProps> = ({
  language = 'en',
  preloadLanguage = true,

  fallback = language,
  preloadFallback = false,

  translations = {},

  unstable_transition = false,

  children
}) => {
  /**
   * Two states are needed depending on usage:
   * - `lang` for transition feature
   * - `current` for immediate update
   */
  const [lang, setLanguage] = React.useState(language);
  const [current, setCurrent] = React.useState(language);

  const preload = (next: string) => {
    suspendPreload(translations[next], keyed(next));
  };

  if (preloadLanguage && language !== lang) {
    preload(lang);
  }

  if (preloadFallback && language !== fallback) {
    preload(fallback);
  }

  const transition = unstable_transition ? startTransition : invoke;
  const change = (next: string) => {
    setCurrent(next);

    transition(() => {
      setLanguage(next);
    });
  };

  const t = React.useCallback((path: string, values: TranslationValues = {}) => {
    let result = EMPTY;

    if (lang in translations) {
      result = lookup(path, values, suspend(translations[lang], keyed(lang)));
    }

    if (result === EMPTY && lang !== fallback && fallback in translations) {
      result = lookup(path, values, suspend(translations[fallback], keyed(fallback)));
    }

    return result;
  }, [lang]);

  const translation = React.useMemo(() => ({
    all: Object.keys(translations),
    lang: current,
    change,
    preload
  }), [current]);

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

/**
 * Note: you need to wrap your component in Suspense
 *
 * @see https://reactjs.org/docs/concurrent-mode-suspense.html
 */
export const useTranslation = () => {
  return React.useContext(TranslationContext);
};

export const useTranslationChange = () => {
  return React.useContext(TranslationChangeContext);
};

/**
 * Note: you need to wrap your component in Suspense
 *
 * @see https://reactjs.org/docs/concurrent-mode-suspense.html
 */
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

/**
 * Use only if you want to wrap your own Suspense
 *
 * @param props.path - translation property path like `header.title.text`
 * @param props.values - for mustache templates
 *
 * @see {@link Translation}
 */
// @ts-expect-error DefinitelyTyped issue
export const TranslationRender: FC<TranslationProps> = ({ path, values }) => {
  const t = useTranslation();

  return t(path, values);
};

/**
 * Recommended way to use i18nano
 *
 * @param props.children - fallback ReactElement, for example loader or skeleton
 * @param props.path - translation property path like `header.title.text`
 * @param props.values - for mustache templates
 *
 * @see {@link TranslationRender}
 */
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
