import React from 'react';
import renderer from 'react-test-renderer';

import { waitForSuspense } from './suspense.js';

import {
  DEFAULT_PROPS,
  Module,
  NOOP,
  SUSPENSE
} from './shared.js';

describe('components', () => {
  it('component TranslationRender', async () => {
    expect.assertions(2);

    const component = renderer.create(
      React.createElement(
        Module.TranslationProvider,
        DEFAULT_PROPS,
        React.createElement(
          React.Suspense,
          {
            fallback: SUSPENSE
          },
          React.createElement(
            Module.TranslationRender,
            {
              path: DEFAULT_PROPS.language
            }
          )
        )
      )
    );

    expect(component.toJSON()).toBe(SUSPENSE);

    await renderer.act(NOOP);
    await waitForSuspense(NOOP);

    expect(component.toJSON()).toBe(DEFAULT_PROPS.language);
  });

  it('component Translation', async () => {
    expect.assertions(2);

    const component = renderer.create(
      React.createElement(
        Module.TranslationProvider,
        DEFAULT_PROPS,
        React.createElement(
          Module.Translation,
          {
            path: DEFAULT_PROPS.language
          },
          SUSPENSE
        )
      )
    );

    expect(component.toJSON()).toBe(SUSPENSE);

    await renderer.act(NOOP);
    await waitForSuspense(NOOP);

    expect(component.toJSON()).toBe(DEFAULT_PROPS.language);
  });
});
