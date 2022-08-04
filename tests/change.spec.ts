import React from 'react';
import renderer from 'react-test-renderer';

import { waitForSuspense } from './suspense.js';

import {
  Module,
  NOOP,
  SUSPENSE,
  TRANSLATIONS,
  TRANSLATIONS_KEYS
} from './shared.js';

describe('change', () => {
  it.each([
    [TRANSLATIONS_KEYS[0], TRANSLATIONS_KEYS[0]],
    [TRANSLATIONS_KEYS[0], TRANSLATIONS_KEYS[1]],
    [TRANSLATIONS_KEYS[1], TRANSLATIONS_KEYS[0]],
    [TRANSLATIONS_KEYS[1], TRANSLATIONS_KEYS[1]]
  ])('switch lang correctly from "%s" to "%s"', async (from, to) => {
    expect.assertions(2);

    const component = renderer.create(
      React.createElement(
        Module.TranslationProvider,
        {
          language: from,
          translations: TRANSLATIONS
        },

        // @ts-expect-error React 17 incompatible type
        React.createElement(() => {
          const translation = Module.useTranslationChange();

          React.useEffect(() => {
            translation.change(to);
          }, []);

          return translation.lang;
        })
      )
    );

    expect(component.toJSON()).toBe(from);

    await renderer.act(NOOP);
    await waitForSuspense(NOOP);

    expect(component.toJSON()).toBe(to);
  });

  it.each([
    [TRANSLATIONS_KEYS[0], TRANSLATIONS_KEYS[0], [
      [TRANSLATIONS_KEYS[0], SUSPENSE],
      [TRANSLATIONS_KEYS[0], TRANSLATIONS_KEYS[0]],
      [TRANSLATIONS_KEYS[0], TRANSLATIONS_KEYS[0]],
      [TRANSLATIONS_KEYS[0], TRANSLATIONS_KEYS[0]]
    ]],
    [TRANSLATIONS_KEYS[0], TRANSLATIONS_KEYS[1], [
      [TRANSLATIONS_KEYS[0], SUSPENSE],
      [TRANSLATIONS_KEYS[0], TRANSLATIONS_KEYS[0]],
      TRANSLATIONS_KEYS[1],
      TRANSLATIONS_KEYS[1]
    ]],
    [TRANSLATIONS_KEYS[1], TRANSLATIONS_KEYS[0], [
      [TRANSLATIONS_KEYS[1], SUSPENSE],
      [TRANSLATIONS_KEYS[1], TRANSLATIONS_KEYS[1]],
      TRANSLATIONS_KEYS[0],
      TRANSLATIONS_KEYS[0]
    ]],
    [TRANSLATIONS_KEYS[1], TRANSLATIONS_KEYS[1], [
      [TRANSLATIONS_KEYS[1], SUSPENSE],
      [TRANSLATIONS_KEYS[1], TRANSLATIONS_KEYS[1]],
      [TRANSLATIONS_KEYS[1], TRANSLATIONS_KEYS[1]],
      [TRANSLATIONS_KEYS[1], TRANSLATIONS_KEYS[1]]
    ]]
  ])('suspend correctly from "%s" to "%s"', async (from, to, cases) => {
    expect.assertions(4);

    let change: (lang: string) => void;

    const component = renderer.create(
      React.createElement(
        Module.TranslationProvider,
        {
          language: from,

          // Prevent fallback
          fallback: 'fallback',
          translations: TRANSLATIONS
        },

        // @ts-expect-error React 17 incompatible type
        React.createElement(() => {
          const translation = Module.useTranslationChange();

          change = translation.change;

          return translation.lang;
        }),
        React.createElement(Module.Translation, {
          path: from
        }, SUSPENSE)
      )
    );

    expect(component.toJSON()).toStrictEqual(cases[0]);

    await renderer.act(NOOP);
    await waitForSuspense(NOOP);

    expect(component.toJSON()).toStrictEqual(cases[1]);

    await renderer.act(() => change(to));

    expect(component.toJSON()).toStrictEqual(cases[2]);

    await waitForSuspense(NOOP);

    expect(component.toJSON()).toStrictEqual(cases[3]);
  });
});
