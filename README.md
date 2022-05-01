# i18nano [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/eolme/i18nano/blob/master/LICENSE) [![BundlePhobia](https://img.shields.io/bundlephobia/minzip/i18nano)](https://bundlephobia.com/package/i18nano) [![BundlePhobia](https://img.shields.io/bundlephobia/min/i18nano)](https://bundlephobia.com/package/i18nano) [![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://github.com/eolme/i18nano/blob/master/tests)

> Internationalization for the react is done simply.

Lightweight translation module with functionality similar to react-i18next.

## Features

- Async translation loading 
- Fallback translations
- Preloading translations
- [Mustache](https://mustache.github.io/)-like templates
- Deep object property lookup
- And other cool stuff

## Usage

Let's create typical, unopinionated and simple component with the following structure:

```tsx
import { TranslationProvider, Translation } from 'i18nano';
import { load } from './load';

const translations = {
  // dynamic import static json
  'en': () => import('translations/en.json'),
  // or with custom load function
  'ru': () => load('ru')
};

export const App = () => {
  return (
    <TranslationProvider translations={translations}>
      <header>
        <Translation path="header">
          Loading...
        </Translation>
      </header>
    </TranslationProvider>
  );
};
```

And that's all it takes! For other available provider options see [definition](./src/types.ts#L25-L35).

### Components

- `Translation` - recommended way to use i18nano
- `TranslationRender` - low level rendering component

### Hooks

- `useTranslation` - returns the function to extract the translation
- `useTranslationChange` - returns the object with information and useful functions such as `switch` and `preload` languages

### HOCs

- `withTranslation` - injects the translation function
- `withTranslationChange` - injects the information and useful functions

### Switch

To switch between languages, let's create a component using the hook as follows:

```tsx
import { useTranslationChange } from 'i18nano';

export const LanguageChange = () => {
  const translation = useTranslationChange();

  return (
    <select value={translation.lang} onChange={(event) => {
      translation.change(event.target.value);
    }}>
      {translation.all.map((lang) => (
        <option key={lang} value={lang}>
          {lang}
        </option>
      ))}
    </select>
  );
};
```

## Concurrent features

If you use react 18 it is recommended to use `transition`.
Then when you switch languages, the last downloaded translation will be displayed instead of the loader.

## Split

You can use several TranslationProviders to split up translation files, for example:

```tsx
import { TranslationProvider, Translation } from 'i18nano';

const translations = {
  header: {
    'en': () => import('translations/header/en.json')
  },
  main: {
    'en': () => import('translations/main/en.json')
  }
};

export const Header = () => {
  return (
    <TranslationProvider translations={translations.header}>
      <header>
        <Translation path="title" />
      </header>
    </TranslationProvider>
  );
};

export const Main = () => {
  return (
    <TranslationProvider translations={translations.main}>
      <h1>
        <Translation path="title" />
      </h1>
    </TranslationProvider>
  );
};
```

## Installation

Recommend to use [yarn](https://classic.yarnpkg.com/en/docs/install/) for dependency management:

```shell
yarn add i18nano
```

## License

i18nano is [MIT licensed](./LICENSE).
