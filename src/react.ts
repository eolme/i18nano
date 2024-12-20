import * as React from 'react';
export { React };

type PropsWithChildren<P> = P & { children?: React.ReactNode | undefined };

export type FC<P> = (props: P) => React.ReactElement<any, any>;
export type FCC<P> = (props: PropsWithChildren<P>) => React.ReactElement<any, any>;

// TODO: remove when types are updated
type ReactUsePromise<T> = PromiseLike<T> & {
  status?: 'pending' | 'fulfilled' | 'rejected';
  value?: T;
  reason?: unknown;
};

const inline = (str: string) => str.toString();
const ReactNextUse = (React as any)[inline('use')];
const ReactNextPromise = ReactNextUse as <T>(promise: ReactUsePromise<T>) => T;
const ReactNextContext = ReactNextUse as <T>(context: React.Context<T>) => T;

const STATUS_PENDING = 'pending';
const STATUS_FULFILLED = 'fulfilled';
const STATUS_REJECTED = 'rejected';

// Polyfill for `React.use` with promise
// It is cached, so it acts like the original
export const use = ReactNextPromise || ((promise) => {
  /* eslint-disable @typescript-eslint/no-throw-literal */

  if (promise.status === STATUS_FULFILLED) {
    return promise.value;
  }

  if (promise.status === STATUS_REJECTED) {
    throw promise.reason;
  }

  if (promise.status === STATUS_PENDING) {
    throw promise;
  }

  promise.status = STATUS_PENDING;
  promise.then(
    (value) => {
      promise.status = STATUS_FULFILLED;
      promise.value = value;
    },
    (ex) => {
      promise.status = STATUS_REJECTED;
      promise.reason = ex;
    }
  );

  throw promise;
});

// Allow component-free use
export const useContext = ReactNextContext || React.useContext;
