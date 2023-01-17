import { EMPTY } from './const';

export const invoke = (scope: () => void) => scope();

export const noop = () => { /* Noop */ };
export const notranslate = () => EMPTY;

export const plain = (record: Record<never, never>) => {
  for (const key in record) {
    return false;
  }

  return true;
};

