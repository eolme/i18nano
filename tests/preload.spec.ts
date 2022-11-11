import { describe, it, expect, vi } from 'vitest';

import React from 'react';
import renderer from 'react-test-renderer';

import { Module, NOOP } from './shared.js';

describe('preload', () => {
  it.each([
    ['language', 1, 0],
    ['fallback', 0, 1]
  ])('nested', async (lang, language, fallback) => {
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
            translations: translationsNested
          },
          React.createElement(() => {
            const change = Module.useTranslationChange();

            change.preload(lang);

            return null;
          })
        )
      )
    );

    await renderer.act(NOOP);

    expect(translations.language).toHaveBeenCalledTimes(language);
    expect(translations.fallback).toHaveBeenCalledTimes(fallback);

    expect(translationsNested.language).toHaveBeenCalledTimes(language);
    expect(translationsNested.fallback).toHaveBeenCalledTimes(fallback);
  });
});
