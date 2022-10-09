import type { PropsWithChildren, ComponentType as _ComponentType, FC as _FC } from 'react';

type PropsWithoutChildren<P> = P extends any ? ('children' extends keyof P ? Pick<P, Exclude<keyof P, 'children'>> : P) : P;

// eslint-disable-next-line @typescript-eslint/ban-types
export type FC<P = {}> = _FC<PropsWithoutChildren<P>>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type FCC<P = {}> = _FC<PropsWithChildren<P>>;

export type { _ComponentType as ComponentType };
