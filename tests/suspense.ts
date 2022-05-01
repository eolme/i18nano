/**
 * Adopted from react-suspense-test-utils
 *
 * @module react-suspense-test-utils
 * @see https://github.com/facebook/react/blob/main/packages/react-suspense-test-utils/src/ReactSuspenseTestUtils.js
 */

import React from 'react';

const ReactCurrentDispatcher = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher;

export const waitForSuspense = async <T>(fn: () => T): Promise<T> => {
  const cache = new Map();
  const testDispatcher = {
    getCacheForType<R>(resourceType: () => R): R {
      let entry: R | void = cache.get(resourceType);

      if (typeof entry === 'undefined') {
        entry = resourceType();
        cache.set(resourceType, entry);
      }

      return entry;
    }
  };

  return new Promise((resolve, reject) => {
    const retry = () => {
      const prevDispatcher = ReactCurrentDispatcher.current;

      ReactCurrentDispatcher.current = testDispatcher;
      try {
        const result = fn();

        resolve(result);
      } catch (ex: unknown) {
        if (ex instanceof Promise) {
          ex.then(retry, retry);
        } else {
          reject(ex);
        }
      } finally {
        ReactCurrentDispatcher.current = prevDispatcher;
      }
    };

    retry();
  });
};
