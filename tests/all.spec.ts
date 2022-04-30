import React from 'react';
import renderer from 'react-test-renderer';
import { waitForSuspense } from './suspense';

import * as Module from '../src';

const TRANSLATIONS = {
  ru: async () => ({
    ru: 'ru'
  }),
  it: async () => ({
    it: 'it'
  })
};

const TRANSLATIONS_KEYS = Object.keys(TRANSLATIONS);

const SUSPENSE = 'suspense';

const NOOP = () => {
  // Noop
};

describe('all spec', () => {
  it('renders correctly', () => {
    expect.assertions(1);

    const component = renderer.create(
      React.createElement(Module.TranslationProvider)
    );

    expect(component.toTree()).toMatchObject({
      nodeType: 'component',
      type: Module.TranslationProvider,
      props: {},
      instance: null,
      rendered: null
    });
  });

  it('renders correctly children', () => {
    expect.assertions(1);

    const component = renderer.create(
      React.createElement(
        Module.TranslationProvider,
        null,
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
    ['language', TRANSLATIONS_KEYS[0], 'lang', TRANSLATIONS_KEYS[0]],
    ['translations', TRANSLATIONS, 'all', TRANSLATIONS_KEYS]
  ])('handles prop "%s" correctly', (prop, value, by, match) => {
    expect.assertions(1);

    const component = renderer.create(
      React.createElement(
        Module.TranslationProvider,
        {
          [prop]: value
        },

        // @ts-expect-error DefinitelyTyped issue
        React.createElement(() => {
          const translation: Record<string, unknown> = Module.useTranslationChange();

          return translation[by];
        })
      )
    );

    expect(component.toJSON()).toStrictEqual(match);
  });

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

        // @ts-expect-error DefinitelyTyped issue
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

        // @ts-expect-error DefinitelyTyped issue
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
