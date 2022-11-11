import type { TranslationLoader, TranslationValues } from './types.js';

import { use } from './react.js';

// TODO: use react cache
const cache = new Map<TranslationLoader, Promise<TranslationValues>>();

export const cached = (fn: TranslationLoader) => {
  const promise = cache.get(fn) || fn();

  cache.set(fn, promise);

  return promise;
};

export const suspend = (fn: TranslationLoader) => use(cached(fn));
