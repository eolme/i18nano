import { describe, it, expect } from 'vitest';

import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { waitForSuspense } from './suspense.js';

import {
  createDefaultProps,
  Module,
  NOOP,
  SUSPENSE
} from './shared.js';

describe('components', () => {
  it('component TranslationRender', async () => {
    expect.assertions(2);

    const props = createDefaultProps();

    const component = renderer.create(
      React.createElement(
        Module.TranslationProvider,
        props,
        React.createElement(
          React.Suspense,
          {
            fallback: SUSPENSE
          },
          React.createElement(
            Module.TranslationRender,
            {
              path: props.language
            }
          )
        )
      )
    );

    expect(component.toJSON()).toBe(SUSPENSE);

    await renderer.act(NOOP);
    await waitForSuspense(NOOP);

    expect(component.toJSON()).toBe(props.language);
  });

  it('component Translation', async () => {
    expect.assertions(2);

    const props = createDefaultProps();

    const component = renderer.create(
      React.createElement(
        Module.TranslationProvider,
        props,
        React.createElement(
          Module.Translation,
          {
            path: props.language
          },
          SUSPENSE
        )
      )
    );

    expect(component.toJSON()).toBe(SUSPENSE);

    await renderer.act(NOOP);
    await waitForSuspense(NOOP);

    expect(component.toJSON()).toBe(props.language);
  });
});
