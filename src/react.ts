import * as React from 'react';

type PropsWithChildren<P> = P & { children?: React.ReactNode | undefined };

export type FC<P> = (props: P) => React.ReactElement<any, any>;
export type FCC<P> = (props: PropsWithChildren<P>) => React.ReactElement<any, any>;

// TODO: remove when types are updated
type ReactUse = <T>(promise: PromiseLike<T> | React.Context<T>) => T;

export const use = (React as any)[String('use')] as ReactUse;

export { React };
