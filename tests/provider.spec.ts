import * as React from 'react';
import renderer from 'react-test-renderer';

import { fn } from 'jest-mock';

import { waitForSuspense } from './suspense.js';

import {
  DEFAULT_PROPS,
  Module,
  NOOP,
  SUSPENSE,
  TRANSLATIONS,
  TRANSLATIONS_KEYS
} from './shared.js';

describe('provider', () => {
  it('renders correctly', () => {
    expect.assertions(1);

    const component = renderer.create(
      React.createElement(
        Module.TranslationProvider,
        DEFAULT_PROPS,
        React.createElement('div', {
          'data-children': true
        })
      )
    );

    expect(component.toTree()!.rendered).toMatchObject({
      nodeType: 'host',
      type: 'div',
      props: {
        'data-children': true
      },
      instance: null,
      rendered: []
    });
  });

  it.each([
    ['language', 0],
    ['fallback', 1]
  ])('handles prop "%s" correctly', async (prop, key) => {
    expect.assertions(2);

    const component = renderer.create(
      React.createElement(
        Module.TranslationProvider,
        {
          language: TRANSLATIONS_KEYS[0],
          preloadLanguage: false,
          fallback: TRANSLATIONS_KEYS[1],
          preloadFallback: false,
          translations: TRANSLATIONS
        },
        React.createElement(
          Module.Translation,
          {
            path: TRANSLATIONS_KEYS[key]
          },
          SUSPENSE
        )
      )
    );

    expect(component.toJSON()).toBe(SUSPENSE);

    await renderer.act(NOOP);
    await waitForSuspense(NOOP);

    expect(component.toJSON()).toBe(TRANSLATIONS_KEYS[key]);
  });

  it.each([
    ['preloadLanguage', false, 0, 0],
    ['preloadLanguage', true, 1, 0],
    ['preloadFallback', false, 0, 0],
    ['preloadFallback', true, 0, 1]
  ])('handles prop "%s" correctly', async (prop, value, lc, fc) => {
    expect.assertions(2);

    const translations = {
      language: fn(async () => ({})),
      fallback: fn(async () => ({}))
    };

    renderer.create(
      React.createElement(
        Module.TranslationProvider,
        {
          language: 'language',
          preloadLanguage: false,
          fallback: 'fallback',
          preloadFallback: false,
          translations,
          [prop]: value
        }
      )
    );

    await renderer.act(NOOP);

    expect(translations.language).toHaveBeenCalledTimes(lc);
    expect(translations.fallback).toHaveBeenCalledTimes(fc);
  });
});
