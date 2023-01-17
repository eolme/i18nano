import type { NextPage } from 'next';

import { Lang } from '../components/Lang';
import { Translation, TranslationProvider } from 'i18nano';
import { default as Link } from 'next/link';

import { DEFAULT_LANGUAGE, translations } from '../i18n';

type ReadmeProps = {
  lang: string;
};

const Readme: NextPage<ReadmeProps> = ({ lang }) => {
  return (
    <TranslationProvider
      language={lang}
      fallback={DEFAULT_LANGUAGE}
      translations={translations.readme}
      transition={true}
    >
      <Lang />
      <h1><Translation path="title" /></h1>
      <Link href="/">
        <Translation path="home" />
      </Link>
    </TranslationProvider>
  );
};

export default Readme;
