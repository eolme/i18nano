import type { TranslationLoader, TranslationPromise } from './types.js';

import { use } from './react.js';

const cache = new Map<TranslationLoader, TranslationPromise>();

export const cached = (fn: TranslationLoader) => {
  let promise = cache.get(fn);

  if (typeof promise === 'undefined') {
    promise = fn();
    cache.set(fn, promise);
  }

  return promise;
};

export const suspend = (fn: TranslationLoader) => use(cached(fn));
