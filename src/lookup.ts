import type { TranslationValues } from './types.js';

import { EMPTY } from './const.js';
import { plain } from './utils.js';

/**
 * @param path - property path like 'a.b.c'
 * @param values - object
 * @returns string from values if found otherwise empty string
 */
export const lookup = (path: string | number, values: TranslationValues): string => {
  // Keys have too complex types

  if (plain(values)) {
    return EMPTY;
  }

  let key = String(path);

  if (key in values) {
    const inner = values[key as any];

    if (typeof inner === 'string') {
      return inner;
    }

    return EMPTY;
  }

  const parts = key.split('.');

  for (let i = 0, length = parts.length; i < length && typeof values === 'object'; ++i) {
    key = parts[i];

    if (key in values) {
      const inner = values[key as any];

      if (typeof inner === 'string') {
        return inner;
      }

      values = inner;
    }
  }

  return EMPTY;
};
