import { describe, it, expect, vi } from 'vitest';

import React from 'react';
import renderer from 'react-test-renderer';

import { waitForSuspense } from './suspense.js';

import {
  createDefaultProps,
  createTranslations,
  Module,
  NOOP,
  SUSPENSE,
  TRANSLATIONS_KEYS
} from './shared.js';

describe('provider', () => {
  it('renders correctly', () => {
    expect.assertions(1);

    const props = createDefaultProps();

    const component = renderer.create(
      React.createElement(
        Module.TranslationProvider,
        props,
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
          translations: createTranslations()
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
      language: vi.fn(async () => ({})),
      fallback: vi.fn(async () => ({}))
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

  it.each([
    ['preloadLanguage', false, 0, 0],
    ['preloadLanguage', true, 1, 0],
    ['preloadFallback', false, 0, 0],
    ['preloadFallback', true, 0, 1]
  ])('handles nested prop "%s" correctly', async (prop, value, lc, fc) => {
    expect.assertions(4);

    const translations = {
      language: vi.fn(async () => ({})),
      fallback: vi.fn(async () => ({}))
    };

    const translationsNested = {
      language: vi.fn(async () => ({})),
      fallback: vi.fn(async () => ({}))
    };

    renderer.create(
      React.createElement(
        Module.TranslationProvider,
        {
          language: 'language',
          preloadLanguage: false,
          fallback: 'fallback',
          preloadFallback: false,
          translations
        },
        React.createElement(
          Module.TranslationProvider,
          {
            language: 'language',
            preloadLanguage: false,
            fallback: 'fallback',
            preloadFallback: false,
            translations: translationsNested,
            [prop]: value
          }
        )
      )
    );

    await renderer.act(NOOP);

    expect(translations.language).toHaveBeenCalledTimes(0);
    expect(translations.fallback).toHaveBeenCalledTimes(0);

    expect(translationsNested.language).toHaveBeenCalledTimes(lc);
    expect(translationsNested.fallback).toHaveBeenCalledTimes(fc);
  });
});
