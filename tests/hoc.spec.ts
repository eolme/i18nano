import * as React from 'react';
import renderer from 'react-test-renderer';

import {
  DEFAULT_PROPS,
  Module,
  NOOP
} from './shared.js';

describe('hoc', () => {
  it('hoc withTranslation', async () => {
    expect.assertions(1);

    renderer.create(
      React.createElement(
        Module.TranslationProvider,
        DEFAULT_PROPS,
        React.createElement(
          Module.withTranslation(({ t }) => {
            expect(t).toBeInstanceOf(Function);

            return null;
          })
        )
      )
    );

    await renderer.act(NOOP);
  });

  it('hoc withTranslationChange', async () => {
    expect.assertions(5);

    renderer.create(
      React.createElement(
        Module.TranslationProvider,
        DEFAULT_PROPS,
        React.createElement(
          Module.withTranslationChange(({ translation }) => {
            expect(translation).toBeInstanceOf(Object);
            expect(translation.all).toStrictEqual(Object.keys(DEFAULT_PROPS.translations));
            expect(translation.lang).toBe(DEFAULT_PROPS.language);
            expect(translation.change).toBeInstanceOf(Function);
            expect(translation.preload).toBeInstanceOf(Function);

            return null;
          })
        )
      )
    );

    await renderer.act(NOOP);
  });
});
