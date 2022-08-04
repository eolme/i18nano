import type { ComponentType, FC, FCC } from './compat.js';
import type {
  TranslationChange,
  TranslationChangeProps,
  TranslationFunction,
  TranslationFunctionProps,
  TranslationProps,
  TranslationProviderProps,
  TranslationValues
} from './types.js';

import * as React from 'react';

import { suspend, preload as suspendPreload } from 'suspend-react';

import { default as get } from 'get-value';

const EMPTY = '';

const GET_OPTIONS = {
  default: EMPTY
} as const;

const noop = () => {
  // Noop
};

const invoke = (scope: () => void) => {
  scope();
};

let id = 0;
const useInstanceId = () => React.useMemo(() => `${id++}`, []);

/**
 * React 18+ concurrent feature
 */
const {
  unstable_startTransition = invoke,
  startTransition = unstable_startTransition,

  useId = useInstanceId
} = React as unknown as {
  unstable_startTransition: typeof invoke;
  startTransition: typeof invoke;

  useId: typeof useInstanceId;
};

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

const lookup = (path: string, values: TranslationValues | null, lang: TranslationValues) => {
  let resolved = lookupValue(path, lang);

  if (values !== null) {
    resolved = resolved.replace(/{{(.+?)}}/g, (_, key) => lookupValue(key, values));
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

export const TranslationProvider: FCC<TranslationProviderProps> = ({
  language,
  preloadLanguage = true,

  fallback = language,
  preloadFallback = false,

  translations,

  transition = false,

  children
}) => {
  /**
   * Two states are needed depending on usage:
   * - `lang` for transition feature
   * - `current` for immediate update
   */
  const [lang, setLanguage] = React.useState(language);
  const [current, setCurrent] = React.useState(language);

  const instance = useId();
  const keyed = (key: string) => [instance + key];

  const preload = (next: string) => {
    suspendPreload(translations[next], keyed(next));
  };

  if (preloadLanguage && language === lang) {
    preload(lang);
  }

  if (preloadFallback && language !== fallback) {
    preload(fallback);
  }

  const withTransition = transition ? startTransition : invoke;
  const change = (next: string) => {
    setCurrent(next);

    withTransition(() => {
      setLanguage(next);
    });
  };

  const t = React.useCallback<TranslationFunction>((path, values = null) => {
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
  const WithTranslation: FCC<P> = (props) => {
    const t = useTranslation();

    return React.createElement(Component, Object.assign({}, props, { t }));
  };

  return WithTranslation;
};

export const withTranslationChange = <P>(Component: ComponentType<P & TranslationChangeProps>) => {
  const WithTranslationChange: FCC<P> = (props) => {
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
// @ts-expect-error React 17 incompatible type
export const TranslationRender: FC<TranslationProps> = ({
  path,
  values = null
}) => {
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
export const Translation: FCC<TranslationProps> = ({
  children = null,
  path,
  values = null
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
