import * as React from 'react';
import renderer from 'react-test-renderer';

import {
  DATE,
  DEFAULT_PROPS,
  LIST,
  Module,
  ModuleFormat,
  NUMBER,
  PLURAL,
  RELATIVE,
  TRANSLATIONS_KEYS
} from './shared.js';

describe('format', () => {
  it('formats correctly', async () => {
    expect.assertions(3);

    let change: (lang: string) => void;

    const component = renderer.create(
      React.createElement(
        Module.TranslationProvider,
        DEFAULT_PROPS,

        // @ts-expect-error React 17 incompatible type
        React.createElement(() => {
          const translation = Module.useTranslationChange();

          change = translation.change;

          return translation.lang;
        }),
        React.createElement(
          ModuleFormat.FormatProvider,
          null,

          // @ts-expect-error React 17 incompatible type
          React.createElement(() => ModuleFormat.useFormatDate(DATE.options.datetime).format(DATE.value)),

          // @ts-expect-error React 17 incompatible type
          React.createElement(() => ModuleFormat.useFormatDate(DATE.options.date).format(DATE.value)),

          // @ts-expect-error React 17 incompatible type
          React.createElement(() => ModuleFormat.useFormatDate(DATE.options.time).format(DATE.value)),

          // @ts-expect-error React 17 incompatible type
          React.createElement(() => ModuleFormat.useFormatNumber(NUMBER.options).format(NUMBER.value)),

          // @ts-expect-error React 17 incompatible type
          React.createElement(() => ModuleFormat.useFormatRelative(RELATIVE.options).format(RELATIVE.value, RELATIVE.unit)),

          // @ts-expect-error React 17 incompatible type
          React.createElement(() => ModuleFormat.useFormatList(LIST.options).format(LIST.value)),

          // @ts-expect-error React 17 incompatible type
          React.createElement(() => ModuleFormat.useFormatPlural(PLURAL.options).select(PLURAL.value))
        )
      )
    );

    expect(component.toJSON()).toMatchObject([
      TRANSLATIONS_KEYS[0],
      DATE[TRANSLATIONS_KEYS[0]].datetime,
      DATE[TRANSLATIONS_KEYS[0]].date,
      DATE[TRANSLATIONS_KEYS[0]].time,
      NUMBER[TRANSLATIONS_KEYS[0]],
      RELATIVE[TRANSLATIONS_KEYS[0]],
      LIST[TRANSLATIONS_KEYS[0]],
      PLURAL[TRANSLATIONS_KEYS[0]]
    ]);

    await renderer.act(() => change(TRANSLATIONS_KEYS[1]));

    expect(component.toJSON()).toMatchObject([
      TRANSLATIONS_KEYS[1],
      DATE[TRANSLATIONS_KEYS[1]].datetime,
      DATE[TRANSLATIONS_KEYS[1]].date,
      DATE[TRANSLATIONS_KEYS[1]].time,
      NUMBER[TRANSLATIONS_KEYS[1]],
      RELATIVE[TRANSLATIONS_KEYS[1]],
      LIST[TRANSLATIONS_KEYS[1]],
      PLURAL[TRANSLATIONS_KEYS[1]]
    ]);

    await renderer.act(() => change(TRANSLATIONS_KEYS[0]));

    expect(component.toJSON()).toMatchObject([
      TRANSLATIONS_KEYS[0],
      DATE[TRANSLATIONS_KEYS[0]].datetime,
      DATE[TRANSLATIONS_KEYS[0]].date,
      DATE[TRANSLATIONS_KEYS[0]].time,
      NUMBER[TRANSLATIONS_KEYS[0]],
      RELATIVE[TRANSLATIONS_KEYS[0]],
      LIST[TRANSLATIONS_KEYS[0]],
      PLURAL[TRANSLATIONS_KEYS[0]]
    ]);
  });
});
