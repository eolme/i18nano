export type TranslationValues = {
  [key: string | number]: string | TranslationValues;
} | Array<string | TranslationValues>;

export type TranslationFunction = (path: string, values?: TranslationValues | null | undefined) => string;

export type TranslationFunctionProps = {
  t: TranslationFunction;
};

export type TranslationChange = Readonly<{
  all: string[];
  lang: string;
  change: (next: string) => void;
  preload: (next: string) => void;
}>;

export type TranslationChangeProps = {
  translation: TranslationChange;
};

export type TranslationProps = {
  path: string;
  values?: TranslationValues | null | undefined;
};

export type TranslationProviderProps = {
  language: string;
  preloadLanguage?: boolean;

  fallback?: string;
  preloadFallback?: boolean;

  translations: Record<string, () => Promise<TranslationValues>>;

  transition?: boolean;
};
