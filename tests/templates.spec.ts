import { describe, expect, it } from 'vitest';

import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { waitForSuspense } from './suspense.js';

import {
  createTranslations,
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
        {
          language: 'ru',
          translations: createTranslations()
        },
        React.createElement(
          Module.TranslationProvider,
          {
            language: 'it',
            translations: createTranslations()
          },
          React.createElement(
            Module.Translation,
            {
              path: 'template',
              values: VALUES
            }
          )
        )
      )
    );

    await renderer.act(NOOP);
    await waitForSuspense(NOOP);

    expect(component.toJSON()).toBe(`0 1 2 3 ru it`);
  });
});
