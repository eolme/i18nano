export type TranslationValues = {
  [key: string]: string | TranslationValues;
};

export type TranslationFunction = (path: string, values?: TranslationValues) => string;
export type TranslationFunctionProps = {
  t: TranslationFunction;
};

export type TranslationChange = Readonly<{
  lang: string;
  change: (next: string) => void;
  preload: (next: string) => void;
}>;
export type TranslationChangeProps = {
  translation: TranslationChange;
};

export type TranslationProps = {
  path: string;
  values?: TranslationValues;
};
