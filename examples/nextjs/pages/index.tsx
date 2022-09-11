import type { NextPage } from 'next';

import { Lang } from '../components/Lang';
import { Translation, TranslationProvider } from 'i18nano';
import { default as Link } from 'next/link';

import { DEFAULT_LANGUAGE, translations } from '../i18n';

type HomeProps = {
  lang: string;
};

const Home: NextPage<HomeProps> = ({ lang }) => {
  return (
    <TranslationProvider
      language={lang}
      fallback={DEFAULT_LANGUAGE}
      translations={translations.home}
      transition={true}
    >
      <Lang />
      <h1><Translation path="title" /></h1>
      <Link href="/readme" passHref={true}>
        <a><Translation path="readme" /></a>
      </Link>
    </TranslationProvider>
  );
};

export default Home;
