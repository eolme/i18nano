export type TranslationValues = {
  [key: string | number]: string | TranslationValues;
} | Array<string | TranslationValues>;

export type TranslationLoader = () => Promise<TranslationValues>;

export type TranslationFunction = (path: string, values?: TranslationValues | undefined) => string;

export type TranslationChange = Readonly<{
  all: string[];
  lang: string;
  change: (next: string) => void;
  preload: (next: string) => void;
}>;

export type TranslationProps = {
  path: string;
  values?: TranslationValues | undefined;
};

export type TranslationProviderProps = {
  language: string;
  preloadLanguage?: boolean;

  fallback?: string;
  preloadFallback?: boolean;

  translations: Record<string, TranslationLoader>;

  transition?: boolean;
};
