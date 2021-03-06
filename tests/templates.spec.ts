import React from 'react';
import renderer from 'react-test-renderer';

import { waitForSuspense } from './suspense.js';

import {
  DEFAULT_PROPS,
  Module,
  NOOP,
  VALUES
} from './shared.js';

describe('templates', () => {
  it('should interpolate mustache-like templates', async () => {
    expect.assertions(1);

    const component = renderer.create(
      React.createElement(
        Module.TranslationProvider,
        DEFAULT_PROPS,
        React.createElement(
          Module.Translation,
          {
            path: 'template',
            values: VALUES
          }
        )
      )
    );

    await renderer.act(NOOP);
    await waitForSuspense(NOOP);

    expect(component.toJSON()).toBe('0 1 2 3');
  });
});
