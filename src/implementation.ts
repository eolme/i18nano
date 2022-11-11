import type { FC, FCC } from './react.js';
import type {
  TranslationChange,
  TranslationFunction,
  TranslationProps,
  TranslationProviderProps,
  TranslationValues
} from './types.js';

import {
  React,
  use
} from './react.js';

import { EMPTY, PLAIN } from './const.js';
import { invoke, noop, notranslate } from './utils.js';
import { cached, suspend } from './suspend.js';
import { lookup } from './lookup.js';

export const TranslationContext = React.createContext<TranslationFunction>(notranslate);
export const TranslationChangeContext = React.createContext<TranslationChange>({
  all: [],
  lang: EMPTY,
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
  const parentTranslate = use(TranslationContext);
  const parentTranslateChange = use(TranslationChangeContext);

  /**
   * Two states are needed depending on usage:
   * - `lang` for transition feature
   * - `current` for immediate update
   */
  const [lang, setLanguage] = React.useState(language);
  const [current, setCurrent] = React.useState(language);

  const withTransition = transition ? React.startTransition : invoke;

  const preload = (next: string) => {
    cached(translations[next]);
  };

  const preloadRecursive = (next: string) => {
    preload(next);
    parentTranslateChange.preload(next);
  };

  if (preloadLanguage && language === lang) {
    preload(lang);
  }

  if (preloadFallback && language !== fallback) {
    preload(fallback);
  }

  const change = (next: string) => {
    setCurrent(next);

    withTransition(() => {
      setLanguage(next);
    });
  };

  const changeRecursive = (next: string) => {
    change(next);
    parentTranslateChange.change(next);
  };

  const interpolate = (path: string, values: TranslationValues, source: TranslationValues) => {
    const template = lookup(path, source);

    if (template.length === 0) {
      return EMPTY;
    }

    return template.replace(/{{(.+?)}}/g, (_, key) => {
      let result = lookup(key, values);

      if (result.length === 0) {
        result = lookup(key, source);
      }

      if (result.length === 0) {
        result = parentTranslate(key, values);
      }

      return result;
    });
  };

  const translate: TranslationFunction = (path, values = PLAIN) => {
    let result = EMPTY;

    if (lang in translations) {
      result = interpolate(path, values, suspend(translations[lang]));
    }

    if (result.length === 0 && lang !== fallback && fallback in translations) {
      result = interpolate(path, values, suspend(translations[fallback]));
    }

    if (result.length === 0) {
      result = parentTranslate(path, values);
    }

    return result;
  };

  const TranslationContextProps = React.useMemo(() => ({
    value: translate
  }), [lang]);

  const TranslationChangeContextProps = React.useMemo(() => ({
    value: {
      all: Object.keys(translations),
      lang: current,
      change: changeRecursive,
      preload: preloadRecursive
    }
  }), [current]);

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
export const useTranslation = () => use(TranslationContext);

export const useTranslationChange = () => use(TranslationChangeContext);

/**
 * Use only if you want to wrap your own Suspense
 *
 * @param props.path - translation property path like `header.title.text`
 * @param props.values - for mustache templates
 *
 * @see {@link Translation}
 */
// @ts-expect-error DefinitelyTyped issue
export const TranslationRender: FC<TranslationProps> = React.memo(({
  path,
  values = PLAIN
}) => {
  const translate = useTranslation();

  return translate(path, values);
});

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
  children,
  path,
  values = PLAIN
}) => {
  return React.createElement(
    React.Suspense,
    { fallback: children },
    React.createElement(
      TranslationRender,
      { path, values }
    )
  );
};
